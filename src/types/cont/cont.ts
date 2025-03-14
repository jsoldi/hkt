import { IMonad, monad } from "../../classes/monad.js";
import { $I } from "../../core/hkt.js";
import { memo } from "../../core/utils.js";
import { free } from "../free/free.js";
import { IFunctorFree } from "../free/functorFree.js";
import { IMonadFree } from "../free/monadFree.js";
import { KLazy } from "../lazy.js";
import { KTask } from "../task.js";
import { contCore, ICont } from "./contCore.js";
import { contFunctorFree, IContFunctorFree } from "./contFunctorFree.js";
import { contMonad, IContMonad } from "./contMonad.js";
import { contMonadFree, IContMonadFree } from "./contMonadFree.js";
import { contVoid, IContVoid } from "./contVoid.js";

/** The continuation factory. */
export interface IContFactory {
    /** The identity continuation, where computations immediately return a value. */
    readonly trivial: IContMonad<$I>
    /** The void continuation, where computations do not return a value. */
    readonly void: IContVoid
    /** The trampoline continuation for stack-safe recursion. */
    readonly trampoline: IContMonadFree<KLazy>
    /** The trampoline continuation for stack-safe async recursion. */
    readonly trampolineAsync: IContMonadFree<KTask>
    /** Creates a continuation monad where results are wrapped in type `M`. */
    ofType<M>(): ICont<M>
    /** Creates a continuation monad where results are wrapped in a monad. */
    ofMonad<M>(m: IMonad<M>): IContMonad<M>
    /** Creates a continuation monad where results are wrapped in a free monad given a functor. */
    ofFunctorFree<M>(m: IFunctorFree<M>): IContFunctorFree<M>
    /** Creates a continuation monad where results are wrapped in a free monad given a monad. */
    ofMonadFree<M>(m: IMonadFree<M>): IContMonadFree<M>
}

/** The continuation factory. */
export const cont: IContFactory = (() => {
    const getTrivial = memo(() => contMonad<$I>(monad.trivial));
    const getTrampoline = memo(() => contMonadFree(free.trampoline));
    const getTrampolineAsync = memo(() => contMonadFree(free.trampolineAsync));
    
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
export { IContVoid, ContVoid } from "./contVoid.js";
export { IContMonad } from "./contMonad.js";
export { IContFunctorFree, ContFree } from "./contFunctorFree.js";
export { IContMonadFree } from "./contMonadFree.js";
