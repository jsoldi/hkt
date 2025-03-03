import { functor, IFunctor, IFunctorBase } from "./functor.js";
import { $ } from "../core/hkt.js";
import { IMonad } from "./monad.js";
import { IMonoid } from "./monoid.js";
import { num } from "../types/primitive.js";
import { TypeClassArg } from "./utilities.js";
import { chain, pipe } from "../core/utils.js";

export interface IFoldBase<F, G> extends IFunctorBase<F> { 
    // This is the monad that contains the maybe-pair if this was the fixed 
    // point of IFunctor<F>. See https://en.wikipedia.org/wiki/Catamorphism
    readonly scalar: IMonad<G> 
    foldl<A, B>(f: (b: B, a: A) => B): (b: B) => (fa: $<F, A>) => $<G, B>
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
}

const is_fold = Symbol('is_fold');

export function fold<F, G>(base: TypeClassArg<IFoldBase<F, G>, IFold<F, G>, typeof is_fold>): IFold<F, G> {
    if (is_fold in base)
        return base;

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
            const all: I['all'] = <A>(p: (a: A) => unknown) => (fa: $<F, A>) => base.foldl<A, boolean>((acc, a) => acc && !!p(a))(true)(fa);
            const any: I['any'] = <A>(p: (a: A) => unknown) => (fa: $<F, A>) => base.foldl<A, boolean>((acc, a) => acc || !!p(a))(false)(fa);
        
            const avg: I['avg'] = chain(
                base.foldl<number, [number, number]>(([sum, count], n) => [sum + n, count + 1])([0, 0]),
                base.scalar.fmap(([sum, count]) => sum / count)
            );

            return {
                [is_fold]: true,
                toArray,
                fold: _fold,
                reduce,
                length,
                sum,
                avg,
                any,
                all,
                ...base,
            };        
        }
    )
}
