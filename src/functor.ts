import { ITypeClass, KApp } from "./hkt.js"

export interface IFunctorBase<F> extends ITypeClass<F> {
    map: <A, B>(fa: KApp<F, A>, f: (a: A) => B) => KApp<F, B>
}

export interface IFunctor<F> extends IFunctorBase<F> {
    fmap<A, B>(f: (a: A) => B): (fa: KApp<F, A>) => KApp<F, B>
    fmap<A, B, C>(f: (a: A) => B, g: (b: B) => C): (fa: KApp<F, A>) => KApp<F, C>
    fmap<A, B, C, D>(f: (a: A) => B, g: (b: B) => C, h: (c: C) => D): (fa: KApp<F, A>) => KApp<F, D>
    fmap<A, B, C, D, E>(f: (a: A) => B, g: (b: B) => C, h: (c: C) => D, i: (d: D) => E): (fa: KApp<F, A>) => KApp<F, E>
    fmap<A, B, C, D, E, G>(f: (a: A) => B, g: (b: B) => C, h: (c: C) => D, i: (d: D) => E, j: (e: E) => G): (fa: KApp<F, A>) => KApp<F, G>
    fmap<A, B, C, D, E, G, H>(f: (a: A) => B, g: (b: B) => C, h: (c: C) => D, i: (d: D) => E, j: (e: E) => G, k: (f: G) => H): (fa: KApp<F, A>) => KApp<F, H>
    fmap<A, B, C, D, E, G, H, I>(f: (a: A) => B, g: (b: B) => C, h: (c: C) => D, i: (d: D) => E, j: (e: E) => G, k: (f: G) => H, l: (g: H) => I): (fa: KApp<F, A>) => KApp<F, I>
    fmap<A, B, C, D, E, G, H, I, J>(f: (a: A) => B, g: (b: B) => C, h: (c: C) => D, i: (d: D) => E, j: (e: E) => G, k: (f: G) => H, l: (g: H) => I, m: (h: I) => J): (fa: KApp<F, A>) => KApp<F, J>
    fmap<A, B, C, D, E, G, H, I, J, K>(f: (a: A) => B, g: (b: B) => C, h: (c: C) => D, i: (d: D) => E, j: (e: E) => G, k: (f: G) => H, l: (g: H) => I, m: (h: I) => J, n: (i: J) => K): (fa: KApp<F, A>) => KApp<F, K>
}

export function functor<F>(base: IFunctorBase<F>): IFunctor<F> {
    const fmap = (...fs: ((...s: any[]) => any)[]) =>
        (m: KApp<F, any>) => fs.reduce((acc, f) => base.map(acc, f), m); // TODO: Test this

    return {
        map: base.map,
        fmap,
    };
}
