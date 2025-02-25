import { IFunctor } from "../../classes/functor.js";
import { IMonad } from "../../classes/monad.js";
import { functorFree, IFunctorFree } from "./functorFree.js";
import { IMonadFree, monadFree } from "./monadFree.js";

export interface IFreeFactory {
    ofFunctor<F>(f: IFunctor<F>): IFunctorFree<F>
    ofMonad<F>(m: IMonad<F>): IMonadFree<F>
}

export const free: IFreeFactory = (() => {
    return {
        ofFunctor: functorFree,
        ofMonad: monadFree
    };
})();

export { Free, KFree, IFunctorFree } from "./functorFree.js";
export { IMonadFree } from "./monadFree.js";
