import { $, $B2, ITypeClass } from "../core/hkt.js";
import { TypeClassArg } from "./utilities.js";
import { chain, id } from "../core/utils.js";
import { IMonad } from "./monad.js";

/** The minimal definition of a traversable. */
export interface ITraversableBase<F> extends ITypeClass<F> {
    /** Map each element in `fa` to a monad and evaluate the results from left to right. */
    traverse<M>(m: IMonad<M>): <A, B>(f: (a: A) => $<M, B>) => (fa: $<F, A>) => $<M, $<F, B>>
}

/** The traversable interface. */
export type ITraversable<F> = ITraversableBase<F> & {
    /** Evaluate each monadic value in `fma` from left to right. */
    sequence<M>(m: IMonad<M>): <A>(fma: $<F, $<M, A>>) => $<M, $<F, A>>
    /** Nest a traversable within another traversable. */
    nestTraversable<G>(t: ITraversableBase<G>): ITraversable<$B2<F, G>>
}

const is_traversable = Symbol("is_traversable");

/** Creates an `ITraversable` from an `ITraversableBase`. */
export function traversable<F>(base: TypeClassArg<ITraversableBase<F>, ITraversable<F>, typeof is_traversable>): ITraversable<F> {
    if (is_traversable in base)
        return base;

    const sequence = <M>(m: IMonad<M>): (<A>(ta: $<F, $<M, A>>) => $<M, $<F, A>>) => base.traverse(m)(id);
    
    const nestTraversable = <G>(g: ITraversableBase<G>) => traversable<$B2<F, G>>({
        traverse: m => chain(g.traverse(m), base.traverse(m))
    });

    return {
        ...{ [is_traversable]: true },
        sequence,
        nestTraversable,
        ...base
    }
}
