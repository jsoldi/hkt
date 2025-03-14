import { IFunctorBase } from "./functor.js";
import { $, $I } from "../core/hkt.js";
import { Maybe } from "../types/maybe.js";
import { ITrivial, monad } from "./monad.js";
import { IUnfold, unfold } from "./unfold.js";
import { TypeClassArg } from "./utilities.js";

/** The minimal definition of an unfoldable. */
export interface IUnfoldableBase<F> extends IFunctorBase<F> {
    /** Unfolds new elements by applying the given function to a seed value. */
    unfold<A, B>(alg: (b: B) => Maybe<[A, B]>): (b: B) => $<F, A>
}

/** The unfoldable interface, where `scalar` is the trivial (identity) monad. */
export interface IUnfoldable<F> extends IUnfoldableBase<F>, IUnfold<F, $I> {
    /** The trivial (identity) monad. */
    readonly scalar: ITrivial;
}

const is_unfoldable = Symbol('is_unfoldable');

/** Creates an `IUnfoldable` from an `IUnfoldableBase`. */
export function unfoldable<F>(base: TypeClassArg<IUnfoldableBase<F>, IUnfoldable<F>, typeof is_unfoldable>): IUnfoldable<F> {
    if (is_unfoldable in base)
        return base;

    return {
        ...{ [is_unfoldable]: true },
        ...unfold<F, $I>({
            scalar: monad.trivial,
            ...base
        }),
        scalar: monad.trivial,
    };
}
