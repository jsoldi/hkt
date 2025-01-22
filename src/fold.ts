import { functor, IFunctor, IFunctorBase } from "./functor.js";
import { $, $K } from "./hkt.js";
import { IMonoid } from "./monoid.js";
import { num } from "./primitive.js";
import { chain } from "./utils.js";

/**
 * I think the idea of this is that a MonadPlus can be reduced to a Monad by collapsing its monoidal structure.
 */
export interface IFoldBase<F, G> {
    readonly scalar: IFunctor<G>
    foldl<A, B>(f: (b: B, a: A) => B): (b: B) => (fa: $<F, A>) => $<G, B>
    wrap<A>(ga: $<G, A>): $<F, A>
}

export interface IFold<F, G> extends IFoldBase<F, G>, IFunctor<F> {    
    toArray<A>(fa: $<F, A>): $<G, A[]>
    collapse<A>(m: IMonoid<$<$K, A>>): (fa: $<F, A>) => $<G, A>
    size(fa: $<F, unknown>): $<G, number>
    sum(fa: $<F, number>): $<G, number>
    avg(fa: $<F, number>): $<G, number>
}

export function fold<F, G>(base: IFoldBase<F, G> & IFunctorBase<F> & Partial<IFold<F, G>>): IFold<F, G> {
    type I = IFold<F, G>;

    const toArray: I['toArray'] = <A>(fa: $<F, A>) => base.foldl((acc: A[], a: A) => [...acc, a])([])(fa);
    const collapse: I['collapse'] = m => base.foldl(m.append)(m.empty());
    const size: I['size'] = fa => base.foldl((acc: number, _: unknown) => acc + 1)(0)(fa);
    const sum: I['sum'] = collapse(num.sum);

    const avg: I['avg'] = chain(
        base.foldl<number, [number, number]>(([sum, count], n) => [sum + n, count + 1])([0, 0]),
        base.scalar.fmap(([sum, count]) => sum / count)
    );

    return {
        ...functor(base),
        toArray,
        collapse,
        size,
        sum,
        avg,
        ...base,
    };
}
