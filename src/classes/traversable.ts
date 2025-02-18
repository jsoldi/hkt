import { IApplicative } from "./applicative.js";
import { $, $B2, ITypeClass } from "../core/hkt.js";
import { TypeClassArg } from "./utilities.js";
import { chain, id } from "../core/utils.js";

export interface ITraversableBase<F> extends ITypeClass<F> {
    traverse<M>(m: IApplicative<M>): <A, B>(f: (a: A) => $<M, B>) => (ta: $<F, A>) => $<M, $<F, B>>
}

export type ITraversable<F> = ITraversableBase<F> & {
    sequence<M>(m: IApplicative<M>): <A>(ta: $<F, $<M, A>>) => $<M, $<F, A>>
    nestTraversable<G>(t: ITraversableBase<G>): ITraversable<$B2<F, G>>
}

const is_traversable = Symbol("is_traversable");

export function traversable<F>(base: TypeClassArg<ITraversableBase<F>, ITraversable<F>, typeof is_traversable>): ITraversable<F> {
    if (is_traversable in base)
        return base;

    const sequence = <M>(m: IApplicative<M>): (<A>(ta: $<F, $<M, A>>) => $<M, $<F, A>>) => base.traverse(m)(id);
    
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
