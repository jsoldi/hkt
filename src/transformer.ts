import { $, $3, $I } from "./hkt.js";
import { IMonad, IMonadBase, monad } from "./monad.js";
import { TypeClassArg } from "./utilities.js";
import { id, pipe } from "./utils.js";

export interface IMonadTransBase<T, M> extends IMonadBase<$<T, M>> {
    lift<A>(ma: $<M, A>): $3<T, M, A>
    wrap<A>(ta: $<$<T, $I>, A>): $3<T, M, A>
}

export interface IMonadTrans<T, M> extends IMonadTransBase<T, M>, IMonad<$<T, M>> {
    flatten<A>(fa: $<M, $3<T, M, A>>): $3<T, M, A>
}

export interface ITransformer<T> {
    transform<M>(base: IMonad<M>): IMonadTrans<T, M>
}

const is_monadTrans = Symbol("is_monadTrans");

export function monadTrans<T, M>(base: TypeClassArg<IMonadTransBase<T, M>, IMonadTrans<T, M>, typeof is_monadTrans>): IMonadTrans<T, M> {
    if (is_monadTrans in base)
        return base;

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
                [is_monadTrans]: true,
                flatten,
                ...base,
            }
        }
    )
}
