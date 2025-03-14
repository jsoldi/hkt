import { IMonad } from "../../classes/monad.js"
import { $, $K1 } from "../../core/hkt.js"
import { pipe } from "../../core/utils.js"
import { ICont, Cont, contCore } from "./contCore.js"
import { ContVoid } from "./contVoid.js"

/** A continuation monad where results are wrapped in a monad. */
export interface IContMonad<M> extends ICont<M> {
    /** The monad that wraps the continuation results. */
    readonly contMonad: IMonad<M>
    /** Lifts a monadic value into the continuation monad. */
    lift<A>(a: $<M, A>): Cont<A, M>
    /** Drops the continuation and returns a monadic value. */
    drop<A>(ca: Cont<A, M>): $<M, A>
    /** Transforms the given continuation into a void continuation. */
    toVoid<A>(ca: Cont<A, M>): ContVoid<A>
}

/** Creates a continuation monad where results are wrapped in the given monad. */
export function contMonad<M>(m: IMonad<M>): IContMonad<M> {
    type I = IContMonad<M>;

    return pipe(
        contCore<M>(),
        base => {
            const toVoid: I['toVoid'] = base.mapCont<M, $K1<void>>(m.unit, _ => undefined);
            const lift: I['lift'] = ma => resolve => m.bind(ma, resolve);
            const drop: I['drop'] = ca => ca(m.unit);
    
            return {
                ...base,
                contMonad: m,
                lift,
                drop,
                toVoid
            }
        }   
    );
}
