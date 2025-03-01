import { KRoot, $ } from "../../core/hkt.js";
import { Left, Right, either } from "../either.js";
import { IMonad, monad } from "../../classes/monad.js";
import { IFunctor } from "../../classes/functor.js";

export type Free<A, F> = Left<A> | Right<$<F, Free<A, F>>>;

export interface KFree<F> extends KRoot {
    readonly 0: unknown
    readonly body: Free<this[0], F>
}

export interface IFunctorFree<F> extends IMonad<KFree<F>> {
    readonly freeBase: IFunctor<F>
    suspend<A>(f: $<F, Free<A, F>>): Free<A, F> 
    delay<A>(f: $<F, A>): Free<A, F>
    mapFreeFrom<G, A>(transform: (ft: $<G, Free<A, G>>) => $<F, Free<A, G>>): (ft: Free<A, G>) => Free<A, F>
    mapFreeTo<G, A>(transform: (ft: $<F, Free<A, G>>) => $<G, Free<A, G>>): (ft: Free<A, F>) => Free<A, G>
    foldFree<A, B>(pure: (a: A) => B, impure: (fb: $<F, B>) => B): (ft: Free<A, F>) => B
}

export function functorFree<F>(freeBase: IFunctor<F>): IFunctorFree<F> {
    const unit = <A, G = F>(a: A): Free<A, G> => either.left(a);
    const suspend = <A, G = F>(f: $<G, Free<A, G>>): Free<A, G> => either.right(f);
    const delay = <A>(fa: $<F, A>): Free<A, F> => suspend(freeBase.map(fa, unit));

    const foldFree = <A, B>(pure: (a: A) => B, impure: (fb: $<F, B>) => B) => function go(ta: Free<A, F>): B {    
        if (ta.right) {
            return impure(freeBase.map(ta.value, go));
        } else {
            return pure(ta.value);
        }
    }

    const bind = <A, B>(fa: Free<A, F>, f: (a: A) => Free<B, F>): Free<B, F> =>
        foldFree<A, Free<B, F>>(f, either.right)(fa);

    const mapFreeFrom = <G, A>(transform: (ft: $<G, Free<A, G>>) => $<F, Free<A, G>>) => function go(ft: Free<A, G>): Free<A, F> {
        if (ft.right) {
            return either.right(freeBase.map(transform(ft.value), go));
        } else {
            return unit(ft.value);
        }
    }

    const mapFreeTo = <G, A>(transform: (ft: $<F, Free<A, G>>) => $<G, Free<A, G>>) => 
        foldFree<A, Free<A, G>>(either.left, ftag => either.right(transform(ftag)));

    return {
        ...monad<KFree<F>>({ unit, bind }),
        freeBase,
        suspend,
        delay,
        foldFree,
        mapFreeFrom,
        mapFreeTo
    };
}
