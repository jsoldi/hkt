import { $I } from "./hkt.js";
import { monad } from "./monad.js";

export const trivial = monad<$I>({
    unit: a => a,
    bind: (fa, f) => f(fa)
});
