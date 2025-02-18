import { ITypeClass, $, $B2 } from "./hkt.js"
import { TypeClassArg } from "./utilities.js";

export interface IFunctorBase<F> extends ITypeClass<F> {
    map: <A, B>(fa: $<F, A>, f: (a: A) => B) => $<F, B>
}

export interface IFunctor<F> extends IFunctorBase<F> {
    fmap<A, B>(f: (a: A) => B): (fa: $<F, A>) => $<F, B>
    nestFunctor<G>(g: IFunctorBase<G>): IFunctor<$B2<F, G>>
}

const is_functor = Symbol("is_functor");

export function functor<F>(base: TypeClassArg<IFunctorBase<F>, IFunctor<F>, typeof is_functor>): IFunctor<F> {
    if (is_functor in base)
        return base;

    const fmap = <A, B>(f: (a: A) => B) => (fa: $<F, A>) => base.map(fa, f);

    const nestFunctor = <G>(g: IFunctorBase<G>) => {
        return functor<$B2<F, G>>({
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
