import { monadPlus } from "../../classes/monadPlus.js";
import { $K1 } from "../../core/hkt.js";
import { Cont } from "./contCore.js";
import { IContMonad, contMonad } from "./contMonad.js";

export type ContVoid<A> = Cont<A, $K1<void>>

/** Continuation isomorphic to promises.*/
export interface IContVoid extends IContMonad<$K1<void>> {
    sleep(delay?: number): Cont<void, $K1<void>>
    toPromise<A>(ca: ContVoid<A>): Promise<A>
    fromPromise<A>(pa: Promise<A>): ContVoid<A>
}

export const contVoid: IContVoid = (() => {
    return {
        ...contMonad<$K1<void>>(monadPlus.void),
        sleep: (delay = 0) => resolve => { setTimeout(resolve, delay) },
        toPromise: ca => new Promise(ca),
        fromPromise: pa => resolve => { pa.then(resolve) }        
    }
})();
