import { $I } from "./hkt.js";
import { IMonad, monad } from "./monad.js";

export type ITrivial = IMonad<$I>;

export const trivial: ITrivial = monad<$I>({
    unit: a => a,
    bind: (fa, f) => f(fa)
});
