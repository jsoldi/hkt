import { $ } from "./hkt.js";
import { IMonad } from "./monad.js";
import { IMonoid } from "./monoid.js";
import { num } from "./primitive.js";
import { chain } from "./utils.js";

/**
 * This is the opposite of a monad plus, kind of a combination of a monad and a comonoid.
 */
export interface IFoldBase<F, G> {
    readonly scalar: IMonad<G>
    foldl<A, B>(f: (b: B, a: A) => B): (b: B) => (fa: $<F, A>) => $<G, B>
    wrap<A>(ga: $<G, A>): $<F, A>
}

export interface IFold<F, G> extends IFoldBase<F, G> {    
    toArray<A>(fa: $<F, A>): $<G, A[]>
    collapse<M>(m: IMonoid<M>): <A>(fa: $<F, $<M, A>>) => $<G, $<M, A>>
    size(fa: $<F, unknown>): $<G, number>
    sum(fa: $<F, number>): $<G, number>
    avg(fa: $<F, number>): $<G, number>
    every<A>(p: (a: A) => unknown): (fa: $<F, A>) => $<G, boolean>
    some<A>(p: (a: A) => unknown): (fa: $<F, A>) => $<G, boolean>
}

export function fold<F, G>(base: IFoldBase<F, G> & Partial<IFold<F, G>>): IFold<F, G> {
    type I = IFold<F, G>;

    const toArray: I['toArray'] = <A>(fa: $<F, A>) => base.foldl((acc: A[], a: A) => [...acc, a])([])(fa);
    const collapse: I['collapse'] = m => base.foldl(m.append)(m.empty());
    const size: I['size'] = fa => base.foldl((acc: number, _: unknown) => acc + 1)(0)(fa);
    const sum: I['sum'] = collapse(num.sum);
    const every: I['every'] = <A>(p: (a: A) => unknown) => (fa: $<F, A>) => base.foldl<A, boolean>((acc, a) => acc && !!p(a))(true)(fa);
    const some: I['some'] = <A>(p: (a: A) => unknown) => (fa: $<F, A>) => base.foldl<A, boolean>((acc, a) => acc || !!p(a))(false)(fa);

    const avg: I['avg'] = chain(
        base.foldl<number, [number, number]>(([sum, count], n) => [sum + n, count + 1])([0, 0]),
        base.scalar.fmap(([sum, count]) => sum / count)
    );

    return {
        toArray,
        collapse,
        size,
        sum,
        avg,
        every,
        some,
        ...base,
    };
}
