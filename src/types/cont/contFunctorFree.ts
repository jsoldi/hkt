import { $ } from "../../core/hkt.js";
import { pipe } from "../../core/utils.js";
import { either } from "../either.js";
import { KFree, Free, IFunctorFree } from "../free/functorFree.js";
import { Cont } from "./contCore.js";
import { contMonad, IContMonad } from "./contMonad.js";

export type ContFree<A, F> = Cont<A, KFree<F>>

export interface IContFunctorFree<F> extends IContMonad<KFree<F>> {
    readonly contMonad: IFunctorFree<F>
    suspend<A>(f: $<F, ContFree<A, F>>): ContFree<A, F>
    lift<A>(lfa: $<F, A>): ContFree<A, F>
    mapThunk<G>(transform: <R>(gt: $<G, Free<Free<R, F>, G>>) => $<F, Free<Free<R, F>, G>>): <A>(ag: Cont<A, KFree<G>>) => ContFree<A, F>
}

export function contFunctorFree<F>(m: IFunctorFree<F>): IContFunctorFree<F> {
    type I = IContFunctorFree<F>;

    return pipe(
        contMonad<KFree<F>>(m),
        base => {
            const suspend: I['suspend'] = f => resolve => m.suspend(m.freeBase.map(f, ct => ct(resolve)));
            const lift: I['lift'] = fa => resolve => m.suspend(m.freeBase.map(fa, resolve))

            const mapThunk = <G>(transform: <R>(gt: $<G, Free<Free<R, F>, G>>) => $<F, Free<Free<R, F>, G>>) => 
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
                lift,
                mapThunk,
            }
        }
    )
}
