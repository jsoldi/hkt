import { $, $I, $Q, KRoot } from "./hkt.js";
import { Maybe } from "./maybe.js";
import { IMonad } from "./monad.js";
import { fold, IFold } from "./fold.js";
import { ITransformer, monadTrans } from "./transformer.js";
import { ITrivial, trivial } from "./trivial.js";
import { IMonadPlus, monadPlus } from "./monadPlus.js";
import { IUnnfold, unfold } from "./unfold.js";

export interface KArray extends KRoot {
    readonly 0: unknown
    readonly body: Array<this[0]>
}

type KArrayTrans = $<$Q, KArray>

interface IArray extends IMonadPlus<KArray>, IFold<KArray, $I>, IUnnfold<KArray, $I>, ITransformer<KArrayTrans> {
    readonly scalar: ITrivial
    first<A>(fa: A[]): A | undefined
    foldr<A, B>(f: (a: A, b: B) => B): (b: B) => (fa: A[]) => B
    filter: {
        <T, S extends T>(predicate: (item: T) => item is S): (items: T[]) => S[];
        <T>(predicate: (item: T) => unknown): (items: T[]) => T[];
    },
    chunks(size: number): <A>(fa: A[]) => A[][]
    distinctBy<A, B>(f: (a: A) => B): (fa: A[]) => A[]
    mapAsync: <A, B>(f: (a: A) => Promise<B>) => (fa: A[]) => Promise<B[]>
    take<A>(n: number): (fa: A[]) => A[]
    skip<A>(n: number): (fa: A[]) => A[]
    zip<A, B>(fa: A[], fb: B[]): [A, B][]
}

export const array: IArray = (() => {
    const filter: {
        <T, S extends T>(predicate: (item: T) => item is S): (items: T[]) => S[];
        <T>(predicate: (item: T) => unknown): (items: T[]) => T[];
    } = <T, S extends T>(predicate: (item: T) => any): (items: T[]) => T[] | S[] => {
        return (items: T[]) => items.filter(predicate);
    };    

    const first = <A>(fa: A[]): A | undefined => fa[0];
    const foldl = <A, B>(f: (b: B, a: A) => B) => (b: B) => (fa: A[]) => fa.reduce(f, b);
    const foldr = <A, B>(f: (a: A, b: B) => B) => (b: B) => (fa: A[]) => fa.reduceRight((a, b) => f(b, a), b);
        
    const _unfold = <A, B>(f: (b: B) => Maybe<[A, B]>) => (b: B): A[] => {
        const result: A[] = [];
        let next = f(b);

        while (next.right) {
            let a: A;
            [a, b] = next.value;
            result.push(a);
            next = f(b);
        }

        return result;
    };

    const transform = <M>(outer: IMonad<M>) => {
        return monadTrans<KArrayTrans, M>({ 
            map: (fa, f) => outer.map(fa, a => a.map(f)),
            unit: a => outer.unit([a]),
            bind: (fa, f) => outer.bind(fa, ae => outer.map(outer.sequence(ae.map(f)), a => a.flat())),
            lift: a => outer.map(a, a => [a])
        });
    }

    const chunk = (size: number) => <A>(fa: A[]): A[][] => {
        if (size < 1)
            throw new Error('Invalid chunk size');

        const result: A[][] = [];

        for (let i = 0; i < fa.length; i += size)
            result.push(fa.slice(i, i + size));

        return result;
    }

    const distinctBy = <A, B>(f: (a: A) => B) => (fa: A[]): A[] => {
        const result: A[] = [];
        const keys = new Set<B>();

        for (const a of fa) {
            const b = f(a);

            if (!keys.has(b)) {
                keys.add(b);
                result.push(a);
            }
        }

        return result;
    }

    // Promises run one by one, not in parallel
    const mapAsync = <A, B>(f: (a: A) => Promise<B>) => async (fa: A[]): Promise<B[]> => {
        const result: B[] = [];
 
        for (const a of fa)
            result.push(await f(a));

        return result;
    }

    const take = <A>(n: number) => (fa: A[]): A[] => n >= 0 ? fa.slice(0, n) : fa.slice(Math.max(fa.length + n, 0));
    const skip = <A>(n: number) => (fa: A[]): A[] => n >= 0 ? fa.slice(n) : fa.slice(0, Math.max(fa.length + n, 0));
    const map = <A, B>(fa: A[], f: (a: A) => B): B[] => fa.map(f);
    const unit = <A>(a: A): A[] => [a];
    const bind = <A, B>(fa: A[], f: (a: A) => B[]): B[] => fa.flatMap(f);
    const empty = <A>(): A[] => [];
    const append = <A>(fa: A[], fb: A[]): A[] => fa.concat(fb);
    const zip = <A, B>(fa: A[], fb: B[]): [A, B][] => Array.from({ length: Math.min(fa.length, fb.length) }, (_, i) => [fa[i], fb[i]]);
    const scalar = trivial;

    return { 
        ...fold<KArray, $I>({
            map,
            scalar,
            foldl,
            wrap: unit,
        }),
        ...unfold<KArray, $I>({
            map,
            scalar,
            unfold: _unfold ,
        }),
        ...monadPlus<KArray>({ 
            map,
            unit, 
            bind,
            empty,
            append,
        }), 
        scalar,
        first,
        filter,
        transform,
        foldl,
        foldr,
        chunks: chunk,
        distinctBy,
        mapAsync,
        take,
        skip,
        zip,
    };
})();
