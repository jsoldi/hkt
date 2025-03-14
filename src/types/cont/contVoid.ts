import { monadPlus } from "../../classes/monadPlus.js";
import { $K1 } from "../../core/hkt.js";
import { either, Either } from "../either.js";
import { Cont } from "./contCore.js";
import { IContMonad, contMonad } from "./contMonad.js";

/** Continuation where computations do not return a value. */
export type ContVoid<A> = Cont<A, $K1<void>>

/** The void continuation interface, where computations do not return a value. */
export interface IContVoid extends IContMonad<$K1<void>> {
    /** Delays the continuation by a number of milliseconds. */
    sleep(delay?: number): ContVoid<void>
    /** Converts a void continuation to a promise. */
    toPromise<A>(ca: ContVoid<Either<unknown, A>>): Promise<A>
    /** Converts a promise to a void continuation. */
    fromPromise<A>(pa: Promise<A>): ContVoid<Either<unknown, A>>
}

/** The void continuation module, where computations do not return a value. */
export const contVoid: IContVoid = (() => {
    return {
        ...contMonad<$K1<void>>(monadPlus.void),
        sleep: (delay = 0) => resolve => { setTimeout(resolve, delay) },
        toPromise: ca => new Promise((resolve, reject) => ca(e => e.right ? resolve(e.value) : reject(e.value))),
        fromPromise: pa => resolve => { pa.then(
            a => resolve(either.right(a)),
            e => resolve(either.left(e))
        ) }
    }
})();
