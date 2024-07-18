import { KApp, KRoot } from "./hkt.js";
import { IMonad } from "./monad.js";

export interface ITransform<F, T> extends IMonad<KApp<T, F>> {
    readonly lift: <A>(a: KApp<F, A>) => KApp<KApp<T, F>, A>
}

export interface ITransMonad<F, T> extends IMonad<F> {
    readonly transform: <F>(outer: IMonad<F>) => ITransform<F, T>
}

export interface KTransform<K> extends KRoot {
    readonly 0: unknown
    readonly 1: unknown
    readonly body: KApp<this[0], KApp<K, this[1]>>
}
