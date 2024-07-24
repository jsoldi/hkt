import { KApp, KApp3, KRoot } from "./hkt.js";
import { IMonad } from "./monad.js";
import { id } from "./utils.js";

export interface IMonadTransBase<T, M> extends IMonad<KApp<T, M>> {
    lift<A>(a: KApp<M, A>): KApp3<T, M, A>
}

export interface IMonadTrans<T, M> extends IMonadTransBase<T, M> {
    flatten<A>(fa: KApp<M, KApp3<T, M, A>>): KApp3<T, M, A>
}

export interface ITransformer<T> {
    readonly transform: <M>(outer: IMonad<M>) => IMonadTrans<T, M>
}

export interface KTransIn<F> extends KRoot {
    readonly 0: unknown // M
    readonly 1: unknown // A
    readonly body: KApp<this[0], KApp<F, this[1]>> // M<F<A>>
}

export interface KTransOut<F> extends KRoot {
    readonly 0: unknown // M
    readonly 1: unknown // A
    readonly body: KApp<F, KApp<this[0], this[1]>> // F<M<A>>
}

export function monadTrans<T, M>(base: IMonadTransBase<T, M>): IMonadTrans<T, M> {
    const flatten = <A>(fa: KApp<M, KApp3<T, M, A>>): KApp3<T, M, A> => 
        base.bind(base.lift(fa), id);

    return {
        ...base,
        flatten
    };
}
