import { ITypeClass, $, $B2 } from "./hkt.js"

export interface IFunctorBase<F> extends ITypeClass<F> {
    map: <A, B>(fa: $<F, A>, f: (a: A) => B) => $<F, B>
}

export interface IFunctor<F> extends IFunctorBase<F> {
    fmap<A, B>(f: (a: A) => B): (fa: $<F, A>) => $<F, B>
    fmap<A, B, C>(f: (a: A) => B, g: (b: B) => C): (fa: $<F, A>) => $<F, C>
    fmap<A, B, C, D>(f: (a: A) => B, g: (b: B) => C, h: (c: C) => D): (fa: $<F, A>) => $<F, D>
    fmap<A, B, C, D, E>(f: (a: A) => B, g: (b: B) => C, h: (c: C) => D, i: (d: D) => E): (fa: $<F, A>) => $<F, E>
    fmap<A, B, C, D, E, G>(f: (a: A) => B, g: (b: B) => C, h: (c: C) => D, i: (d: D) => E, j: (e: E) => G): (fa: $<F, A>) => $<F, G>
    fmap<A, B, C, D, E, G, H>(f: (a: A) => B, g: (b: B) => C, h: (c: C) => D, i: (d: D) => E, j: (e: E) => G, k: (f: G) => H): (fa: $<F, A>) => $<F, H>
    fmap<A, B, C, D, E, G, H, I>(f: (a: A) => B, g: (b: B) => C, h: (c: C) => D, i: (d: D) => E, j: (e: E) => G, k: (f: G) => H, l: (g: H) => I): (fa: $<F, A>) => $<F, I>
    fmap<A, B, C, D, E, G, H, I, J>(f: (a: A) => B, g: (b: B) => C, h: (c: C) => D, i: (d: D) => E, j: (e: E) => G, k: (f: G) => H, l: (g: H) => I, m: (h: I) => J): (fa: $<F, A>) => $<F, J>
    fmap<A, B, C, D, E, G, H, I, J, K>(f: (a: A) => B, g: (b: B) => C, h: (c: C) => D, i: (d: D) => E, j: (e: E) => G, k: (f: G) => H, l: (g: H) => I, m: (h: I) => J, n: (i: J) => K): (fa: $<F, A>) => $<F, K>
    compose<G>(g: IFunctorBase<G>): IFunctor<$B2<F, G>>
}

export function functor<F>(base: IFunctorBase<F>): IFunctor<F> {
    const fmap = (...fs: ((...s: any[]) => any)[]) =>
        (m: $<F, any>) => fs.reduce((acc, f) => base.map(acc, f), m); // TODO: Test this

    const compose = <G>(g: IFunctorBase<G>) => {
        return functor<$B2<F, G>>({
            map: <A, B>(fa: $<F, $<G, A>>, f: (a: A) => B): $<F, $<G, B>> => base.map(fa, ga => g.map(ga, f))
        });
    }

    return {
        fmap,
        compose,
        ...base
    };
}
