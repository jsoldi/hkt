import { IMonad } from "../../classes/monad.js";
import { $ } from "../../core/hkt.js";
import { Free, functorFree, IFunctorFree } from "./functorFree.js";

export interface IMonadFree<F> extends IFunctorFree<F> {
    readonly freeBase: IMonad<F>
    drop<A>(t: Free<A, F>): $<F, A>
}

export function monadFree<F>(freeBase: IMonad<F>): IMonadFree<F> {
    return {
        ...functorFree<F>(freeBase),
        freeBase,
        drop: freeBase.runFree,
    };
}
