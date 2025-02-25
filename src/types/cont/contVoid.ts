import { monadPlus } from "../../classes/monadPlus.js";
import { $K1 } from "../../core/hkt.js";
import { Cont } from "./contCore.js";
import { IContMonad, contMonad } from "./contMonad.js";

/** Continuation isomorphic to promises.*/
export interface IContVoid extends IContMonad<$K1<void>> {
    sleep(delay?: number): Cont<void, $K1<void>>
    toPromise<A>(ca: Cont<A, $K1<void>>): Promise<A>
    fromPromise<A>(pa: Promise<A>): Cont<A, $K1<void>>
}

export const contVoid: IContVoid = (() => {
    return {
        ...contMonad<$K1<void>>(monadPlus.void),
        sleep: (delay = 0) => resolve => { setTimeout(resolve, delay) },
        toPromise: ca => new Promise(ca),
        fromPromise: pa => resolve => { pa.then(resolve) }        
    }
})();
