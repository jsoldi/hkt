import { KRoot } from "./hkt.js";
import { monad } from "./monad.js";

export interface TTrivial extends KRoot {
    readonly 0: unknown
    readonly body: this[0]
}

export const trivial = monad<TTrivial>({
    unit: a => a,
    bind: (fa, f) => f(fa)
});
