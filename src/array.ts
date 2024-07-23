import { KApp, KRoot } from "./hkt.js";
import { IMonad, monad } from "./monad.js";
import { ITransMonad, KTransform } from "./transform.js";

export interface KArray extends KRoot {
    readonly 0: unknown
    readonly body: Array<this[0]>
}

interface IArray extends ITransMonad<KArray> {
    filter: {
        <T, S extends T>(predicate: (item: T) => item is S): (items: T[]) => S[];
        <T>(predicate: (item: T) => boolean): (items: T[]) => T[];
    }
}

export const array: IArray = (() => {
    const m = monad<KArray>({ 
        unit: a => [a], 
        bind: (fa, f) => fa.flatMap(f) 
    });

    const filter: {
        <T, S extends T>(predicate: (item: T) => item is S): (items: T[]) => S[];
        <T>(predicate: (item: T) => boolean): (items: T[]) => T[];
    } = <T, S extends T>(predicate: (item: T) => any): (items: T[]) => T[] | S[] => {
        return (items: T[]) => items.filter(predicate);
    };    

    const transform = <F>(outer: IMonad<F>) => {
        const lift = <A>(a: KApp<F, A>): KApp<F, Array<A>> => outer.map(a, m.unit);

        const mt = monad<KApp<KTransform<KArray>, F>>({
            unit: <A>(a: A): KApp<F, Array<A>> => outer.unit(m.unit(a)),
            bind: <A, B>(fa: KApp<F, Array<A>>, f: (a: A) => KApp<F, Array<B>>): KApp<F, Array<B>> =>
                outer.bind(fa, ae => outer.map(outer.sequence(ae.map(f)), a => a.flat()))
        }); 

        return { ...mt, lift };
    }

    return { ...m, filter, transform };
})();
