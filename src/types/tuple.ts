import { $, $3, $B, $K, KRoot } from "../core/hkt.js"
import { functor, IFunctor } from "../classes/functor.js";
import { IMonoid, monoid } from "../classes/monoid.js";

/** The tuple type, representing a pair of values. */
export interface KTuple1<L> extends KRoot {
    readonly 0: unknown
    readonly body: [L, this[0]]
}

/** The higher-kinded tuple type, representing a pair of values. */
export interface KTuple extends KRoot {
    readonly 0: unknown
    readonly body: KTuple1<this[0]>
}

/** The tuple interface, providing a set of functions for working with tuple values. */
export interface ITuple<L = any> extends IFunctor<$<KTuple, L>> {
    /** Creates a tuple module with a fixed left type. */
    of<T>(): ITuple<T>
    /** Creates a tuple monoid from the given pair of monoids and fixes the left monoid's type argument. */
    monoid<G>(l: IMonoid<$<$K, L>>, r: IMonoid<G>): IMonoid<$3<$B, $<KTuple, L>, G>>
    /** Swaps the values of a tuple. */
    swap<R>(t: [L, R]): [R, L]
    /** Returns the left value of a tuple. */
    left<R>(t: [L, R]): L
    /** Returns the right value of a tuple. */
    right<R>(t: [L, R]): R
    /** Maps over the left and right values of a tuple. */
    bimap<R, S, T>(t: [L, R], f: (a: L) => S, g: (b: R) => T): [S, T]
    /** Maps over the left and right values of a tuple. */
    bifmap<R, S, T>(f: (a: L) => S, g: (b: R) => T): (t: [L, R]) => [S, T]
}

/** Creates a tuple module with a fixed left type. */
function tupleOf<L>(): ITuple<L> {
    const of = <T>() => tupleOf<T>();

    const _monoid = <G>(l: IMonoid<$<$K, L>>, r: IMonoid<G>) => monoid<$3<$B, $<KTuple, L>, G>>({
        empty: <B>() => [l.empty<L>(), r.empty<B>()],
        append: <B>([a1, b1]: [L, $<G, B>], [a2, b2]: [L, $<G, B>]) => [l.append<L>(a1, a2), r.append<B>(b1, b2)],
    });

    const map = <R, S>([a, b]: [L, R], f: (a: R) => S) => [a, f(b)] satisfies [L, S];
    const swap = <R>([a, b]: [L, R]) => [b, a] satisfies [R, L];
    const left = <R>([a, _]: [L, R]) => a;
    const right = <R>([_, b]: [L, R]) => b;
    const bimap = <R, S, T>([a, b]: [L, R], f: (a: L) => S, g: (b: R) => T) => [f(a), g(b)] satisfies [S, T];
    const bifmap = <R, S, T>(f: (a: L) => S, g: (b: R) => T) => ([a, b]: [L, R]) => [f(a), g(b)] satisfies [S, T];

    return {
        of,
        monoid: _monoid,
        swap,
        left,
        right,
        bimap,
        bifmap,
        ...functor<$<KTuple, L>>({ map }),
    }
}

/** The tuple module, providing functions for working with tuple values. The left type is fixed to `any`. To change the left type, call the `of` function. */
export const tuple = tupleOf<any>();
