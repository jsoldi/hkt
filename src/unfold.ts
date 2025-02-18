import { functor, IFunctor, IFunctorBase } from "./functor.js";
import { $ } from "./hkt.js";
import { maybe, Maybe } from "./maybe.js";
import { IMonad } from "./monad.js";
import { TypeClassArg } from "./utilities.js";
import { pipe } from "./utils.js";

export interface IUnfoldBase<F, G> extends IFunctorBase<F> { 
    readonly scalar: IMonad<G> // This is the monad that contains the maybe-pair if this was the fixed point of IFunctor<F>
    unfold<A, B>(alg: (b: B) => $<G, Maybe<[A, B]>>): (b: B) => $<F, A>
}

export interface IUnfold<F, G> extends IUnfoldBase<F, G>, IFunctor<F> {    
    iterate<A>(f: (a: A) => Maybe<A>): (a: A) => $<F, A>
    forLoop<A>(pred: (a: A) => unknown, next: (a: A) => A): (init: A) => $<F, A>
    range(start: number, endExc: number): $<F, number>
}

const is_unfold = Symbol('is_unfold');

export function unfold<F, G>(base: TypeClassArg<IUnfoldBase<F, G>, IUnfold<F, G>, typeof is_unfold>): IUnfold<F, G> {
    if (is_unfold in base)
        return base;

    type I = IUnfold<F, G>;

    return pipe(
        base,
        base => ({
            ...functor<F>(base),
            ...base
        }),
        base => {
            const iterate: I['iterate'] = f => base.unfold(a => base.scalar.unit(maybe.map(f(a), a2 => [a, a2])));
            const forLoop: I['forLoop'] = (pred, next) => iterate(a => pred(a) ? maybe.just(next(a)) : maybe.nothing);
            const range: I['range'] = (start: number, endExc: number) => forLoop<number>(t => t < endExc, t => t + 1)(start);

            return {
                ...{ [is_unfold]: true },
                iterate,
                forLoop,
                range,
                ...base,
            };        
        }
    )
}
