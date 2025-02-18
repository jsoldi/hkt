import { $ } from "../../core/hkt.js";
import { pipe } from "../../core/utils.js";
import { IMonad } from "../../classes/monad.js";
import { cont, Cont, IContCore } from "./cont.js";

export interface IContMonad<M> extends IContCore<M> { 
    lift<A>(fa: $<M, A>): Cont<A, M>
    drop<A>(ca: Cont<A, M>): $<M, A>
}

export function contMonadOf<M>(m: IMonad<M>): IContMonad<M> {
    type I = IContMonad<M>;

    return pipe(
        cont.of<M>(),
        base => {
            const lift: I['lift'] = fa => resolve => m.bind(fa, resolve);
            const drop: I['drop'] = ca => ca(m.unit);

            return {
                ...base,
                lift,
                drop,
            }
        }
    );
}
