import { KApp2, KApp3 } from "./hkt.js";
import { IMonad } from "./monad.js";

export interface ITransform<F, T> extends IMonad<KApp2<T, F>> {
    readonly lift: <A>(a: KApp2<F, A>) => KApp3<T, F, A>
}

export interface ITransMonad<F, T> extends IMonad<F> {
    readonly transform: <F>(outer: IMonad<F>) => ITransform<F, T>
}
