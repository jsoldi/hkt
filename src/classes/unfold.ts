import { functor, IFunctor, IFunctorBase } from "./functor.js";
import { $ } from "../core/hkt.js";
import { maybe, Maybe } from "../types/maybe.js";
import { IMonad } from "./monad.js";
import { TypeClassArg } from "./utilities.js";
import { pipe } from "../core/utils.js";

/** The minimal definition of an unfold. */
export interface IUnfoldBase<F, G> extends IFunctorBase<F> { 
    /**
     * The monad that wraps the result of the unfold operation. As a 
     * [catamorphism](https://en.wikipedia.org/wiki/Catamorphism), 
     * this is the monad that wraps the maybe-tuple of the 
     * fixed-point of `IFunctor<F>`.
     */
    readonly scalar: IMonad<G>;
    /** Unfolds new elements by applying the given function to a seed value. */
    unfold<A, B>(alg: (b: B) => $<G, Maybe<[A, B]>>): (b: B) => $<F, A>;
}

/** The unfold interface, extended by `IUnfoldable`. */
export interface IUnfold<F, G> extends IUnfoldBase<F, G>, IFunctor<F> {    
    /** Iterates by applying the function until it returns nothing. */
    iterate<A>(f: (a: A) => Maybe<A>): (a: A) => $<F, A>;

    /** Builds a sequence, starting from init, while pred is true, then uses next to advance. */
    forLoop<A>(init: A, pred: (a: A) => unknown, next: (a: A) => A): $<F, A>;

    /** Creates a range of numbers from start to end inclusive. */
    range(start: number, end: number): $<F, number>;

    /** Replicates the given value `n` times within the structure. */
    replicate<A>(n: number, a: A): $<F, A>;
}

const is_unfold = Symbol('is_unfold');

/** Creates an `IUnfold` from an `IUnfoldBase`. */
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

            const forLoop: I['forLoop'] = <A>(init: A, pred: (a: A) => unknown, next: (a: A) => A) => 
                iterate<A>(a => pred(a) ? maybe.just(next(a)) : maybe.nothing)(init);

            const range: I['range'] = (start: number, end: number) => forLoop<number>(start, t => t <= end, t => t + 1);

            const replicate: I['replicate'] = (n, a) => base.map(range(1, n), _ => a);

            return {
                ...{ [is_unfold]: true },
                iterate,
                forLoop,
                range,
                replicate,
                ...base,
            };        
        }
    )
}
