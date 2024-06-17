import { HKT } from "./hkt.js";
import { monad } from "./monad.js";

export interface TTrivial extends HKT {
    readonly type: this["_A"]
}

export const trivial = monad<TTrivial>({
    unit: a => a,
    bind: (fa, f) => f(fa)
});
