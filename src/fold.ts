import { functor, IFunctor, IFunctorBase } from "./functor.js";
import { $, $B1, $B2, $Q1, $Q2 } from "./hkt.js";
import { IMonad } from "./monad.js";
import { IMonoid } from "./monoid.js";
import { num } from "./primitive.js";
import { ITransformer } from "./transformer.js";
import { chain, pipe } from "./utils.js";

export interface IFoldBase<F, G> extends IFunctorBase<F> { 
    readonly scalar: IMonad<G> // This is the monad that contains the maybe-pair if this was the fixed point of IFunctor<F>
    foldl<A, B>(f: (b: B, a: A) => B): (b: B) => (fa: $<F, A>) => $<G, B>
    wrap<A>(ga: $<G, A>): $<F, A>
}

export interface IFold<F, G> extends IFoldBase<F, G>, IFunctor<F> {    
    toArray<A>(fa: $<F, A>): $<G, A[]>
    fold<M>(m: IMonoid<M>): <A>(fa: $<F, $<M, A>>) => $<G, $<M, A>>
    reduce<T, U>(acc: U, f: (acc: U, a: T) => U): (fa: $<F, T>) => $<G, U>
    length(fa: $<F, unknown>): $<G, number>
    sum(fa: $<F, number>): $<G, number>
    avg(fa: $<F, number>): $<G, number>
    any<A>(p: (a: A) => unknown): (fa: $<F, A>) => $<G, boolean>
    all<A>(p: (a: A) => unknown): (fa: $<F, A>) => $<G, boolean>
    liftFoldOver<M>(m: IMonad<M> & ITransformer<$Q1<M>>): IFold<$B2<F, M>, $B2<G, M>>
    liftFoldUnder<M>(m: IMonad<M> & ITransformer<$B1<M>>): IFold<$Q2<F, M>, $Q2<G, M>>
}

export function fold<F, G>(base: IFoldBase<F, G> & Partial<IFold<F, G>>): IFold<F, G> {
    type I = IFold<F, G>;

    return pipe(
        base,
        base => ({
            ...functor<F>(base),
            ...base
        }),
        base => {
            const toArray: I['toArray'] = <A>(fa: $<F, A>) => base.foldl((acc: A[], a: A) => [...acc, a])([])(fa);
            const _fold: I['fold'] = m => base.foldl(m.append)(m.empty());
            const reduce: I['reduce'] = <T, U>(acc: U, f: (acc: U, a: T) => U) => base.foldl(f)(acc);
            const length: I['length'] = fa => base.foldl((acc: number, _: unknown) => acc + 1)(0)(fa);
            const sum: I['sum'] = _fold(num.sum);
            const every: I['any'] = <A>(p: (a: A) => unknown) => (fa: $<F, A>) => base.foldl<A, boolean>((acc, a) => acc && !!p(a))(true)(fa);
            const some: I['all'] = <A>(p: (a: A) => unknown) => (fa: $<F, A>) => base.foldl<A, boolean>((acc, a) => acc || !!p(a))(false)(fa);
        
            const avg: I['avg'] = chain(
                base.foldl<number, [number, number]>(([sum, count], n) => [sum + n, count + 1])([0, 0]),
                base.scalar.fmap(([sum, count]) => sum / count)
            );
        
            /** Passed monad must transform from $<M, T> to $<G, $<M, T>> given G */
            const liftFoldOver = <M>(m: IMonad<M> & ITransformer<$Q1<M>>) => {
                return fold<$B2<F, M>, $B2<G, M>>({
                    map: (fma, f) => base.map(fma, m.fmap(f)),
                    scalar: m.transform(base.scalar),
                    foldl: f => b => base.foldl(m.lift2(f))(m.unit(b)),
                    wrap: base.wrap,
                });
            }

            /** Passed monad must transform from $<M, T> to $<M, $<G, T>> given G */
            const liftFoldUnder = <M>(m: IMonad<M> & ITransformer<$B1<M>>) => {
                return fold<$Q2<F, M>, $Q2<G, M>>({
                    map: (fa, f) => m.map(fa, base.fmap(f)),
                    scalar: m.transform(base.scalar),
                    foldl: f => b => m.fmap(base.foldl(f)(b)),
                    wrap: m.fmap(base.wrap)
                });
            }
            
            return {
                toArray,
                fold: _fold,
                reduce,
                length,
                sum,
                avg,
                any: every,
                all: some,
                liftFoldOver,
                liftFoldUnder,
                ...base,
            };        
        }
    )
}
