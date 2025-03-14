import { IMonad } from "../../classes/monad.js";
import { $ } from "../../core/hkt.js";
import { Free, functorFree, IFunctorFree } from "./functorFree.js";

/** The free monad interface based on a monad. */
export interface IMonadFree<F> extends IFunctorFree<F> {
    /** The monad underlying the free monad. */
    readonly freeBase: IMonad<F>
    /** Unwraps the free monad into the underlying monad. Inverse of `IFunctorFree`'s `delay`. */
    run<A>(t: Free<A, F>): $<F, A>
}

/** Creates a free monad from a monad. */
export function monadFree<F>(freeBase: IMonad<F>): IMonadFree<F> {
    return {
        ...functorFree<F>(freeBase),
        freeBase,
        run: freeBase.runFree,
    };
}
