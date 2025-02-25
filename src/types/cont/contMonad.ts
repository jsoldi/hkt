import { IMonad } from "../../classes/monad.js"
import { $K1 } from "../../core/hkt.js"
import { pipe } from "../../core/utils.js"
import { ICont, Cont, contCore } from "./contCore.js"

export interface IContMonad<M> extends ICont<M> {
    readonly contMonad: IMonad<M>
    toVoid<A>(ca: Cont<A, M>): Cont<A, $K1<void>>
}

export function contMonad<M>(m: IMonad<M>): IContMonad<M> {
    type I = IContMonad<M>;

    return pipe(
        contCore<M>(),
        base => {
            const toVoid: I['toVoid'] = base.mapCont<M, $K1<void>>(m.unit, _ => undefined);
    
            return {
                ...base,
                contMonad: m,
                toVoid
            }
        }   
    );
}
