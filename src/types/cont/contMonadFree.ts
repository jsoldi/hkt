import { $ } from "../../core/hkt.js";
import { pipe } from "../../core/utils.js";
import { IMonadFree } from "../free/monadFree.js";
import { ContFree, contFunctorFree, IContFunctorFree } from "./contFunctorFree.js";

/** The continuation monad interface, where results are wrapped in a free monad based on a monad. */
export interface IContMonadFree<F> extends IContFunctorFree<F> {
    /** The monad underlying the free monad that wraps the continuation results. */
    readonly contMonad: IMonadFree<F>
    /** Unwraps the continuation's free monad into the underlying monad. Inverse of `IContMonadFree`'s `delay`. */
    run<A>(cta: ContFree<A, F>): $<F, A> 
}

/** Creates a continuation monad where results are wrapped in a free monad given a free monad based on a monad. */
export function contMonadFree<F>(m: IMonadFree<F>): IContMonadFree<F> {
    type I = IContMonadFree<F>;

    return pipe(
        contFunctorFree<F>(m),
        base => {
            const run: I['run'] = cta => m.run(cta(m.unit));

            return {
                ...base,
                contMonad: m,
                run
            }
        }
    )
}
