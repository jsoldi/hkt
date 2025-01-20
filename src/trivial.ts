import { $I } from "./hkt.js";
import { IMonad, monad } from "./monad.js";

export type ITrivial = IMonad<$I>;

export const trivial: ITrivial = (() => {
    return {
        ...monad<$I>({
            unit: a => a,
            bind: (a, f) => f(a)
        })
    }
})();
