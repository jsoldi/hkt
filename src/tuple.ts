import { functor, IFunctor } from "./functor.js";
import { $, $3, $B, $K, KRoot } from "./hkt.js"
import { IMonoid, monoid } from "./monoid.js";

export interface KTuple extends KRoot {
    readonly 0: unknown
    readonly 1: unknown
    readonly body: [this[0], this[1]]
}

export interface ITuple<L> extends IFunctor<$<KTuple, L>> {
    monoid<G>(l: IMonoid<$<$K, L>>, r: IMonoid<G>): IMonoid<$3<$B, $<KTuple, L>, G>>
    swap<R>(t: [L, R]): [R, L]
    left<R>(t: [L, R]): L
    right<R>(t: [L, R]): R
    bimap<R, S, T>(t: [L, R], f: (a: L) => S, g: (b: R) => T): [S, T]
    bifmap<R, S, T>(f: (a: L) => S, g: (b: R) => T): (t: [L, R]) => [S, T]
}

export function tuple<L>(): ITuple<L> {
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
        monoid: _monoid,
        swap,
        left,
        right,
        bimap,
        bifmap,
        ...functor<$<KTuple, L>>({ map }),
    }
}
