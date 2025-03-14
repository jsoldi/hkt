import { IFunctor } from "../../classes/functor.js";
import { IMonad } from "../../classes/monad.js";
import { memo } from "../../core/utils.js";
import { KLazy, lazy } from "../lazy.js";
import { KTask, task } from "../task.js";
import { functorFree, IFunctorFree } from "./functorFree.js";
import { IMonadFree, monadFree } from "./monadFree.js";

/** The free monad factory. */
export interface IFreeFactory {
    /** A free-monad that uses the lazy functor as the underlying functor for safe tail recursion. */
    trampoline: IMonadFree<KLazy>
    /** A free-monad that uses the task functor as the underlying functor for safe tail recursion. */
    trampolineAsync: IMonadFree<KTask>
    /** Creates a free monad from a functor. */
    ofFunctor<F>(f: IFunctor<F>): IFunctorFree<F>
    /** Creates a free monad from a monad. */
    ofMonad<F>(m: IMonad<F>): IMonadFree<F>
}

/** The free monad module. */
export const free: IFreeFactory = (() => {
    const getTrampoline = memo(() => monadFree<KLazy>(lazy));
    const getTrampolineAsync = memo(() => monadFree<KTask>(task));

    return {
        get trampoline() { return getTrampoline() },
        get trampolineAsync() { return getTrampolineAsync() },
        ofFunctor: functorFree,
        ofMonad: monadFree
    };
})();

export { Free, KFree, IFunctorFree } from "./functorFree.js";
export { IMonadFree } from "./monadFree.js";
