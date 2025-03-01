import { IMonad } from "../../classes/monad.js"
import { $, $K1 } from "../../core/hkt.js"
import { pipe } from "../../core/utils.js"
import { ICont, Cont, contCore } from "./contCore.js"
import { ContVoid } from "./contVoid.js"

export interface IContMonad<M> extends ICont<M> {
    readonly contMonad: IMonad<M>
    lift<A>(a: $<M, A>): Cont<A, M>
    drop<A>(ca: Cont<A, M>): $<M, A>    
    toVoid<A>(ca: Cont<A, M>): ContVoid<A>
}

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
