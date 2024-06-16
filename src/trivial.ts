import { HKT } from "./hkt.js";
import { monad } from "./monad.js";

export interface TrivialHKT extends HKT {
    readonly type: this["_A"]
}

export const trivialMonad = monad<TrivialHKT>({
    unit: a => a,
    bind: (fa, f) => f(fa)
});
