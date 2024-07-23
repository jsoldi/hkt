import { ITypeClass, KApp } from "./hkt.js";

export interface IMonoidBase<F> extends ITypeClass<F> {
    empty: <A>() => KApp<F, A>
    concat: <A>(fa: KApp<F, A>, fb: KApp<F, A>) => KApp<F, A>
}

export interface IMonoid<F> extends IMonoidBase<F> {
    foldMap: <A, B>(as: A[], f: (a: A) => KApp<F, B>) => KApp<F, B>
    concat: <A>(...fa: KApp<F, A>[]) => KApp<F, A>
}

export function monoid<F>(base: IMonoidBase<F>): IMonoid<F> {
    const concat = <A>(...fa: KApp<F, A>[]) => fa.reduce(base.concat, base.empty<A>());
    const foldMap = <A, B>(as: A[], f: (a: A) => KApp<F, B>) => concat(...as.map(f));

    return {
        ...base,
        concat,
        foldMap
    }
}
