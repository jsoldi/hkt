import { IFunctor } from "../../classes/functor.js";
import { IMonad } from "../../classes/monad.js";
import { memo } from "../../core/utils.js";
import { KLazy, lazy } from "../lazy.js";
import { KTask, task } from "../task.js";
import { functorFree, IFunctorFree } from "./functorFree.js";
import { IMonadFree, monadFree } from "./monadFree.js";

export interface IFreeFactory {
    trampoline: IMonadFree<KLazy>
    trampolineAsync: IMonadFree<KTask>
    ofFunctor<F>(f: IFunctor<F>): IFunctorFree<F>
    ofMonad<F>(m: IMonad<F>): IMonadFree<F>
}

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
