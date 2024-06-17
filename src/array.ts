import { HKT } from "./hkt.js";
import { IMonad, monad } from "./monad.js";

export interface TArray extends HKT {
    readonly type: Array<this["_A"]>
}

export const array = monad<TArray>({
    unit: a => [a],
    bind: (fa, f) => fa.flatMap(f)
});
