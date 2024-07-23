import { ITypeClass, KApp } from "./hkt.js"

export interface IFunctorBase<F> extends ITypeClass<F> {
    map: <A, B>(fa: KApp<F, A>, f: (a: A) => B) => KApp<F, B>
}

export interface IFunctor<F> extends IFunctorBase<F> {
    fmap: <A, B>(f: (a: A) => B) => (fa: KApp<F, A>) => KApp<F, B>
}

export function functor<F>(base: IFunctorBase<F>) {
    const fmap = <A, B>(f: (a: A) => B) => (fa: KApp<F, A>) => base.map(fa, f);
    return { ...base, fmap };
}
