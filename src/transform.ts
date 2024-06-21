import { KApp } from "./hkt.js";
import { IMonad } from "./monad.js";

export interface ITransform<F, T> extends IMonad<KApp<T, F>> {
    readonly lift: <A>(a: KApp<F, A>) => KApp<KApp<T, F>, A>
}

export interface ITransMonad<F, T> extends IMonad<F> {
    readonly transform: <F>(outer: IMonad<F>) => ITransform<F, T>
}
