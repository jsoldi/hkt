import { functor } from "./functor.js";
import { KApp, KRoot } from "./hkt.js";
import { IMonad, monad } from "./monad.js";
import { IMonadPlus, monadPlus } from "./monadPlus.js";
import { monoid } from "./monoid.js";
import { ITransformer, KTransIn, monadTrans } from "./transformer.js";

export interface KArray extends KRoot {
    readonly 0: unknown
    readonly body: Array<this[0]>
}

type KArrayTrans = KTransIn<KArray>

interface IArray extends IMonadPlus<KArray>, ITransformer<KArrayTrans> {
    foldl<B>(b: B): <A>(f: (b: B, a: A) => B) => (fa: Array<A>) => B
    foldr<B>(b: B): <A>(f: (a: A, b: B) => B) => (fa: Array<A>) => B
    filter: {
        <T, S extends T>(predicate: (item: T) => item is S): (items: T[]) => S[];
        <T>(predicate: (item: T) => boolean): (items: T[]) => T[];
    }
}

export const array: IArray = (() => {
    const _monadPlus = monadPlus<KArray>({ 
        ...monad<KArray>({
            ...functor<KArray>({
                map: (fa, f) => fa.map(f)
            }),
            unit: a => [a], 
            bind: (fa, f) => fa.flatMap(f),            
        }),
        ...monoid<KArray>({
            empty: <A>() => [] as A[],
            append: <A>(fa: A[], fb: A[]): A[] => fa.concat(fb)
        })
    });

    const filter: {
        <T, S extends T>(predicate: (item: T) => item is S): (items: T[]) => S[];
        <T>(predicate: (item: T) => boolean): (items: T[]) => T[];
    } = <T, S extends T>(predicate: (item: T) => any): (items: T[]) => T[] | S[] => {
        return (items: T[]) => items.filter(predicate);
    };    

    const foldl = <B>(b: B) => <A>(f: (b: B, a: A) => B) => (fa: A[]) => fa.reduce(f, b);
    const foldr = <B>(b: B) => <A>(f: (a: A, b: B) => B) => (fa: A[]) => fa.reduceRight((a, b) => f(b, a), b);

    const transform = <M>(outer: IMonad<M>) => {
        return monadTrans<KArrayTrans, M>({ 
            ...monad<KApp<KArrayTrans, M>>({ 
                ...functor<KApp<KArrayTrans, M>>({
                    map: (fa, f) => outer.map(fa, a => a.map(f))
                }),
                unit: a => outer.unit([a]),
                bind: (fa, f) => outer.bind(fa, ae => outer.map(outer.sequence(ae.map(f)), a => a.flat()))
            }), 
            lift: a => outer.map(a, a => [a])
        });
    }

    return { 
        ..._monadPlus, 
        filter, // override MonadPlus implementation
        transform,
        foldl,
        foldr
    };
})();
