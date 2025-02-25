import { IMonad, monad } from "../../classes/monad.js";
import { $I } from "../../core/hkt.js";
import { memo } from "../../core/utils.js";
import { free } from "../free/free.js";
import { IFunctorFree } from "../free/functorFree.js";
import { IMonadFree } from "../free/monadFree.js";
import { KLazy, lazy } from "../lazy.js";
import { KTask, task } from "../task.js";
import { contCore, ICont } from "./contCore.js";
import { contFunctorFree, IContFunctorFree } from "./contFunctorFree.js";
import { contMonad, IContMonad } from "./contMonad.js";
import { contMonadFree, IContMonadFree } from "./contMonadFree.js";
import { contVoid, IContVoid } from "./contVoid.js";

export interface IContFactory {
    readonly trivial: IContMonad<$I>
    readonly void: IContVoid
    readonly trampoline: IContMonadFree<KLazy>
    readonly trampolineAsync: IContMonadFree<KTask>
    ofType<M>(): ICont<M>
    ofMonad<M>(m: IMonad<M>): IContMonad<M>
    ofFunctorFree<M>(m: IFunctorFree<M>): IContFunctorFree<M>
    ofMonadFree<M>(m: IMonadFree<M>): IContMonadFree<M>
}

export const cont: IContFactory = (() => {
    const getTrivial = memo(() => contMonad<$I>(monad.trivial));
    const getTrampoline = memo(() => contMonadFree(free.ofMonad(lazy)));
    const getTrampolineAsync = memo(() => contMonadFree(free.ofMonad(task)));
    
    return {
        get trivial() { return getTrivial() },
        get void() { return contVoid },
        get trampoline() { return getTrampoline() },
        get trampolineAsync() { return getTrampolineAsync() },
        ofType: contCore,
        ofMonad: contMonad,
        ofFunctorFree: contFunctorFree,
        ofMonadFree: contMonadFree,
    }
})();

export { Cont, KCont, ICont } from "./contCore.js";
export { IContVoid } from "./contVoid.js";
export { IContMonad } from "./contMonad.js";
export { IContFunctorFree } from "./contFunctorFree.js";
export { IContMonadFree } from "./contMonadFree.js";
