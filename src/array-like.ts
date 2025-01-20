import { IFunctor } from "./functor.js";
import { $, $K } from "./hkt.js";
import { IMonoid } from "./monoid.js";
import { chain } from "./utils.js";

export interface IArrayLikeBase<F, G> {
    readonly scalar: IFunctor<G>
    toArray<A>(fa: $<F, A>): $<G, A[]>
    fromArray<A>(as: $<G, A[]>): $<F, A>
}

export interface IArrayLike<F, G> extends IArrayLikeBase<F, G> {
    collapse<A>(monoid: IMonoid<$<$K, A>>): (fsa: $<F, A>) => $<G, A>
    expand<A>(fsa: $<G, A>): $<F, A>
    filter<A, B extends A>(f: (a: A) => a is B): (fa: $<F, A>) => $<F, B>
    filter<A>(p: (a: A) => unknown): (fa: $<F, A>) => $<F, A>
}

export function arrayLike<F, G>(base: IArrayLikeBase<F, G>): IArrayLike<F, G> {
    type I = IArrayLike<F, G>;

    const collapse: I['collapse'] = monoid => chain(
        base.toArray,
        base.scalar.fmap(a => a.reduce(monoid.append, monoid.empty())),
    );

    const expand: I['expand'] = chain(
        base.scalar.fmap(a => [a]),
        base.fromArray,
    );

    const filter: I['filter'] = <A>(p: (a: A) => unknown) => chain(
        base.toArray<A>,
        base.scalar.fmap(a => a.filter(p)),
        base.fromArray,
    );

    return {
        ...base,
        collapse,
        expand,
        filter,
    }
}
