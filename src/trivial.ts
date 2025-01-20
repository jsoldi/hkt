import { $I } from "./hkt.js";
import { IMonad, monad } from "./monad.js";

export const trivial: IMonad<$I> = (() => {
    return {
        ...monad<$I>({
            unit: a => a,
            bind: (a, f) => f(a)
        })
    }
})();
