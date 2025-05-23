import { ITypeClass, $, $B2, $K1 } from "../core/hkt.js"
import { id } from "../core/utils.js";
import { TypeClassArg } from "./utilities.js";

/** The minimal definition of a functor. */
export interface IFunctorBase<F> extends ITypeClass<F> {
    /** Maps a function over a functor. */
    map: <A, B>(fa: $<F, A>, f: (a: A) => B) => $<F, B>
}

/** The functor interface, providing a set of functions for working with functors. */
export interface IFunctor<F> extends IFunctorBase<F> {
    /** Maps a function over a functor. */
    fmap<A, B>(f: (a: A) => B): (fa: $<F, A>) => $<F, B>
    /** Nests a functor within another functor. */
    nestFunctor<G>(g: IFunctorBase<G>): IFunctor<$B2<F, G>>
}

const is_functor = Symbol("is_functor");

export type FunctorArg<F> = TypeClassArg<IFunctorBase<F>, IFunctor<F>, typeof is_functor>;

function _functor<F>(base: FunctorArg<F>): IFunctor<F> {
    if (is_functor in base)
        return base;

    const fmap = <A, B>(f: (a: A) => B) => (fa: $<F, A>) => base.map(fa, f);

    const nestFunctor = <G>(g: IFunctorBase<G>) => {
        return _functor<$B2<F, G>>({
            map: <A, B>(fa: $<F, $<G, A>>, f: (a: A) => B): $<F, $<G, B>> => base.map(fa, ga => g.map(ga, f))
        });
    }

    return {
        ...{ [is_functor]: true },
        fmap,
        nestFunctor,
        ...base
    };
}

/** The functor factory. */
export interface IFunctorFactory {
    /** Creates an `IFunctor` from an `IFunctorBase`. */
    <F>(base: FunctorArg<F>): IFunctor<F>;
    /** Creates an identity `IFunctor`. */
    const<A>(): IFunctor<$K1<A>>;
}

_functor.const = <A>() => _functor<$K1<A>>({ map: id });

/** The functor factory, providing a set of functions for working with functors. */
export const functor: IFunctorFactory = _functor;
