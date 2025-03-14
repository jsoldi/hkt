import { $ } from "../../core/hkt.js";
import { pipe } from "../../core/utils.js";
import { either } from "../either.js";
import { KFree, Free, IFunctorFree } from "../free/functorFree.js";
import { Cont } from "./contCore.js";
import { contMonad, IContMonad } from "./contMonad.js";

/** A continuation monad where results are wrapped in a free monad. */
export type ContFree<A, F> = Cont<A, KFree<F>>

/** The continuation monad interface, where results are wrapped in a free monad based on a functor. */
export interface IContFunctorFree<F> extends IContMonad<KFree<F>> {
    /** The functor underlying the free monad that wraps the continuation results. */
    readonly contMonad: IFunctorFree<F>
    /** Suspends a computation in the continuation monad. */
    suspend<A>(f: $<F, ContFree<A, F>>): ContFree<A, F>
    /** Suspends a computation by wrapping a value in the continuation monad. Inverse of `IContMonadFree`'s `run`. */
    delay<A>(lfa: $<F, A>): ContFree<A, F> 
    /** Changes the free monad's underlying functor from another functor. */
    mapFree<G>(transform: <R>(gt: $<G, Free<Free<R, F>, G>>) => $<F, Free<Free<R, F>, G>>): <A>(ag: ContFree<A, G>) => ContFree<A, F>
}

/** Creates a continuation monad where results are wrapped in a free monad given a free monad based on a functor. */
export function contFunctorFree<F>(m: IFunctorFree<F>): IContFunctorFree<F> {
    type I = IContFunctorFree<F>;

    return pipe(
        contMonad<KFree<F>>(m),
        base => {
            const suspend: I['suspend'] = f => resolve => m.suspend(m.freeBase.map(f, ct => ct(resolve)));
            const delay: I['delay'] = fa => resolve => m.suspend(m.freeBase.map(fa, resolve))

            const mapFree = <G>(transform: <R>(gt: $<G, Free<Free<R, F>, G>>) => $<F, Free<Free<R, F>, G>>) => 
                base.mapCont<KFree<G>, KFree<F>>(
                    either.left, 
                    <R>(fg: Free<Free<R, F>, G>) => 
                        m.flat(m.mapFreeFrom<G, Free<R, F>>(caca => {
                            const rete = transform(caca);
                            return rete;
                        })(fg))
                    
                );

            return {
                ...base,
                contMonad: m,
                suspend,
                delay,
                mapFree,
            }
        }
    )
}
