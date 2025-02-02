import { $I } from "./hkt.js";
import { IMonad, monad } from "./monad.js";
import { ITransformer, monadTrans } from "./transformer.js";
import { id } from "./utils.js";

export type ITrivial = IMonad<$I> & ITransformer<$I>;

export const trivial: ITrivial = {
    ...monad<$I>({
        unit: a => a,
        bind: (fa, f) => f(fa),
    }),
    transform: <M>(inner: IMonad<M>) => monadTrans<$I, M>({ ...inner, lift: id })
}
