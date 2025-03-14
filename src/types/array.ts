import { $, $B2, $Q, KRoot } from "../core/hkt.js";
import { IMonad } from "../classes/monad.js";
import { IFold } from "../classes/fold.js";
import { IMonadTrans, ITransformer, monadTrans } from "../classes/transformer.js";
import { IMonadPlus, monadPlus } from "../classes/monadPlus.js";
import { ITraversable, traversable } from "../classes/traversable.js";
import { foldable, IFoldable } from "../classes/foldable.js";
import { IUnfoldable, unfoldable } from "../classes/unfoldable.js";
import { Maybe } from "./maybe.js";
import { monoid } from "../classes/monoid.js";

/** The array higher-kinded type. */
export interface KArray extends KRoot {
    readonly 0: unknown
    readonly body: Array<this[0]>
}

/** The array transformer higher-kinded type. */
export type KArrayTrans = $<$Q, KArray>

/** The array interface. */
interface IArray extends IMonadPlus<KArray>, IFoldable<KArray>, IUnfoldable<KArray>, ITraversable<KArray>, ITransformer<KArrayTrans> {
    /** Folds the values of `fa` from right to left using the given function and initial value. */
    foldr<A, B>(f: (a: A, b: B) => B): (b: B) => (fa: A[]) => B
    /** Filters the items of an array using a predicate function. */
    filter<T, S extends T>(predicate: (item: T) => item is S): (items: T[]) => S[]
    /** Filters the items of an array using a predicate function. */    
    filter<T>(predicate: (item: T) => unknown): (items: T[]) => T[]
    /** Splits an array into chunks of the given size. */
    chunks(size: number): <A>(fa: A[]) => A[][]
    /** Removes duplicate items from an array using a key function. */
    distinctBy<A, B>(f: (a: A) => B): (fa: A[]) => A[]
    /** Maps an async function over an array. */
    mapAsync: <A, B>(f: (a: A) => Promise<B>) => (fa: A[]) => Promise<B[]>
    /** Takes the first `n` items of an array. */
    take<A>(n: number): (fa: A[]) => A[]
    /** Skips the first `n` items of an array. */
    skip<A>(n: number): (fa: A[]) => A[]
    /** Zips two arrays into an array of pairs. */
    zip<A, B>(fa: A[], fb: B[]): [A, B][]
    /** Produces a monad transformer having `Array` as the inner monad. */
    transform<M>(base: IMonad<M>): IArrayTrans<M>
    /** Lifts the array monoid into a monad. */
    liftMonoid<M>(base: IMonad<M>): IArrayTrans<M>
    /** Sequences an array of monads into a monad of an array. */
    sequence<M>(m: IMonad<M>): {
        (ta: []): $<M, []>
        <A>(ta: [$<M, A>]): $<M, [A]>
        <A, B>(ta: [$<M, A>, $<M, B>]): $<M, [A, B]>
        <A, B, C>(ta: [$<M, A>, $<M, B>, $<M, C>]): $<M, [A, B, C]>
        <A, B, C, D>(ta: [$<M, A>, $<M, B>, $<M, C>, $<M, D>]): $<M, [A, B, C, D]>
        <A, B, C, D, E>(ta: [$<M, A>, $<M, B>, $<M, C>, $<M, D>, $<M, E>]): $<M, [A, B, C, D, E]>
        <A, B, C, D, E, F>(ta: [$<M, A>, $<M, B>, $<M, C>, $<M, D>, $<M, E>, $<M, F>]): $<M, [A, B, C, D, E, F]>
        <A, B, C, D, E, F, G>(ta: [$<M, A>, $<M, B>, $<M, C>, $<M, D>, $<M, E>, $<M, F>, $<M, G>]): $<M, [A, B, C, D, E, F, G]>
        <A, B, C, D, E, F, G, H>(ta: [$<M, A>, $<M, B>, $<M, C>, $<M, D>, $<M, E>, $<M, F>, $<M, G>, $<M, H>]): $<M, [A, B, C, D, E, F, G, H]>
        <A>(ta: $<M, A>[]): $<M, A[]>        
    }
}

/** The array transformer interface. */
export interface IArrayTrans<M> extends IMonadTrans<KArrayTrans, M>, IFold<$B2<M, KArray>, M>, IMonadPlus<$B2<M, KArray>> {
}

/** The array module. */
export const array: IArray = (() => {
    const filter: IArray['filter'] = <T, S extends T>(predicate: (item: T) => any): (items: T[]) => T[] | S[] => {
        return (items: T[]) => items.filter(predicate);
    };    

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

    const _traversable = traversable<KArray>({
        traverse: <M>(m: IMonad<M>) => <A, B>(f: (a: A) => $<M, B>) => (ta: A[]): $<M, B[]> => 
            ta.reduceRight<$<M, B[]>>(
                (acc, a) => m.lift2((b: B, bs: B[]) => [b, ...bs])(f(a), acc), 
                m.unit([])
            )
    });

    const _monadPlus = monadPlus<KArray>({ 
        map,
        unit, 
        bind,
        empty,
        append,
    });

    const _foldable = foldable<KArray>({
        map,
        foldl,
    });

    const transform = <M>(m: IMonad<M>): IArrayTrans<M> => {
        const __monadTrans = monadTrans<KArrayTrans, M>({ 
            map: (fa, f) => m.map(fa, a => a.map(f)),
            unit: a => m.unit([a]),
            bind: (fa, f) => m.bind(fa, ae => m.map(
                _traversable.sequence(m)(ae.map(f)), 
                a => a.flat()
            )),
            lift: a => m.map(a, a => [a]),
            wrap: a => m.unit(a),
        });
        
        const __monoid = monoid<$B2<M, KArray>>({
            empty: <A>() => m.unit<A[]>([]),
            append: (fa, fb) => m.bind(fa, a => a.length === 0 ? fb : m.map(fb, b => a.concat(b)))
        });

        const __foldable: IFold<$B2<M, KArray>, M> = _foldable.liftFoldUnder<M>(m);

        return {
            ...__monadTrans,
            ...__foldable,
            ...monadPlus<$B2<M, KArray>>({
                append: __monoid.append,
                bind: __monadTrans.bind,
                empty: __monoid.empty,
                unit: __monadTrans.unit,
            }),
        }
    }

    return { 
        ..._traversable,
        ..._foldable,
        ...unfoldable<KArray>({
            map,
            unfold: _unfold,
        }),
        ..._monadPlus, 
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
        liftMonoid: transform, // Override default to make it short-circuit on append
        sequence: _traversable.sequence as any,
    };
})();
