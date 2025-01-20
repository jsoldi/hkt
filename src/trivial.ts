import { IToArray, toArray } from "./array-like.js";
import { KArray } from "./array.js";
import { $I } from "./hkt.js";
import { IMonad, monad } from "./monad.js";

export type ITrivial = IMonad<$I> & IToArray<KArray, $I>;

export const trivial: ITrivial = (() => {
    const self: ITrivial = {} as ITrivial;

    Object.assign(self,
        monad<$I>({
            unit: a => a,
            bind: (a, f) => f(a)
        }),
        toArray<$I, $I>({
            scalar: self,
            toArray: a => [a],
        })
    );

    return self;
})();
