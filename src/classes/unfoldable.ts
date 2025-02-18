import { IFunctorBase } from "./functor.js";
import { $, $I } from "../core/hkt.js";
import { Maybe } from "../types/maybe.js";
import { ITrivial, trivial } from "./monad.js";
import { IUnfold, unfold } from "./unfold.js";
import { TypeClassArg } from "./utilities.js";

export interface IUnfoldableBase<F> extends IFunctorBase<F> {
    unfold<A, B>(alg: (b: B) => Maybe<[A, B]>): (b: B) => $<F, A>
}

export interface IUnfoldable<F> extends IUnfoldableBase<F>, IUnfold<F, $I> {
    readonly scalar: ITrivial;
}

const is_unfoldable = Symbol('is_unfoldable');

export function unfoldable<F>(base: TypeClassArg<IUnfoldableBase<F>, IUnfoldable<F>, typeof is_unfoldable>): IUnfoldable<F> {
    if (is_unfoldable in base)
        return base;

    return {
        ...{ [is_unfoldable]: true },
        ...unfold<F, $I>({
            scalar: trivial,
            ...base
        }),
        scalar: trivial,
    };
}
