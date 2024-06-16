import { HKT } from "./hkt.js";
import { monad } from "./monad.js";

export interface ArrayHKT extends HKT {
    readonly type: Array<this["_A"]>
}

export const arrayMonad = monad<ArrayHKT>({
    unit: a => [a],
    bind: (fa, f) => fa.flatMap(f)
});
