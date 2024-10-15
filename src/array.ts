import { $, $Q, KRoot } from "./hkt.js";
import { Maybe } from "./maybe.js";
import { IMonad } from "./monad.js";
import { IMonadPlus, monadPlus } from "./monadPlus.js";
import { ITransformer, monadTrans } from "./transformer.js";

export interface KArray extends KRoot {
    readonly 0: unknown
    readonly body: Array<this[0]>
}

type KArrayTrans = $<$Q, KArray>

interface IArray extends IMonadPlus<KArray>, ITransformer<KArrayTrans> {
    first<A>(fa: A[]): A | undefined
    foldl<A, B>(f: (b: B, a: A) => B): (b: B) => (fa: A[]) => B
    foldr<A, B>(f: (a: A, b: B) => B): (b: B) => (fa: A[]) => B
    unfoldr<A, B>(f: (b: B) => Maybe<[A, B]>): (b: B) => A[]
    filter: {
        <T, S extends T>(predicate: (item: T) => item is S): (items: T[]) => S[];
        <T>(predicate: (item: T) => boolean): (items: T[]) => T[];
    },
    chunk: (size: number) => <A>(fa: A[]) => A[][]
    distinctBy<A, B>(f: (a: A) => B): (fa: A[]) => A[]
    mapAsync: <A, B>(f: (a: A) => Promise<B>) => (fa: A[]) => Promise<B[]>
    take<A>(n: number): (fa: A[]) => A[]
    skip<A>(n: number): (fa: A[]) => A[]
}

export const array: IArray = (() => {
    const filter: {
        <T, S extends T>(predicate: (item: T) => item is S): (items: T[]) => S[];
        <T>(predicate: (item: T) => boolean): (items: T[]) => T[];
    } = <T, S extends T>(predicate: (item: T) => any): (items: T[]) => T[] | S[] => {
        return (items: T[]) => items.filter(predicate);
    };    

    const first = <A>(fa: A[]): A | undefined => fa[0];
    const foldl = <A, B>(f: (b: B, a: A) => B) => (b: B) => (fa: A[]) => fa.reduce(f, b);
    const foldr = <A, B>(f: (a: A, b: B) => B) => (b: B) => (fa: A[]) => fa.reduceRight((a, b) => f(b, a), b);
        
    const unfoldr = <A, B>(f: (b: B) => Maybe<[A, B]>) => (b: B): A[] => {
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

    return { 
        ...monadPlus<KArray>({ 
            map: (fa, f) => fa.map(f),
            unit: a => [a], 
            bind: (fa, f) => fa.flatMap(f),            
            empty: <A>() => [] as A[],
            append: <A>(fa: A[], fb: A[]): A[] => fa.concat(fb)
        }), 
        first,
        filter,
        transform,
        foldl,
        foldr,
        unfoldr,
        chunk,
        distinctBy,
        mapAsync,
        take,
        skip
    };
})();
