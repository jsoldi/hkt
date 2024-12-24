import { $, $3 } from "./hkt.js";
import { IMonad, IMonadBase, monad } from "./monad.js";
import { id, pipe } from "./utils.js";

export interface IMonadTransBase<T, M> extends IMonadBase<$<T, M>> {
    lift<A>(a: $<M, A>): $3<T, M, A>
}

export interface IMonadTrans<T, M> extends IMonadTransBase<T, M>, IMonad<$<T, M>> {
    flatten<A>(fa: $<M, $3<T, M, A>>): $3<T, M, A>
}

export interface ITransformer<T> {
    readonly transform: <M>(base: IMonad<M>) => IMonadTrans<T, M>
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
