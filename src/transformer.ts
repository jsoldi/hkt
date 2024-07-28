import { $, $3, KRoot } from "./hkt.js";
import { IMonad, IMonadBase, monad } from "./monad.js";
import { id, pipe } from "./utils.js";

export interface IMonadTransBase<T, M> extends IMonadBase<$<T, M>> {
    lift<A>(a: $<M, A>): $3<T, M, A>
}

export interface IMonadTrans<T, M> extends IMonadTransBase<T, M>, IMonad<$<T, M>> {
    flatten<A>(fa: $<M, $3<T, M, A>>): $3<T, M, A>
}

export interface ITransformer<T> {
    readonly transform: <M>(outer: IMonad<M>) => IMonadTrans<T, M>
}

// TODO: I think you can define these two using $$, and maybe a `flip` type function

// f => m => a => m(f(a))

export interface KTransIn extends KRoot {
    readonly 0: unknown // F
    readonly 1: unknown // M
    readonly 2: unknown // A
    readonly body: $<this[1], $<this[0], this[2]>> // M<F<A>>
}

export interface KTransOut extends KRoot {
    readonly 0: unknown // F
    readonly 1: unknown // M
    readonly 2: unknown // A
    readonly body: $<this[0], $<this[1], this[2]>> // F<M<A>>
}

export function monadTrans<T, M>(base: IMonadTransBase<T, M> & Partial<IMonadTrans<T, M>>): IMonadTrans<T, M> {
    return pipe(
        base,
        base => ({
            ...monad<$<T, M>>(base),
            ...base
        }),
        base => {
            const flatten = <A>(fa: $<M, $3<T, M, A>>): $3<T, M, A> => 
                base.bind(base.lift(fa), id);

            return {
                flatten,
                ...base,
            }
        }
    )
}
