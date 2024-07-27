import { array } from "./array.js";
import { ITypeClass, KApp } from "./hkt.js";

export interface IMonoidBase<F> extends ITypeClass<F> {
    empty: <A>() => KApp<F, A>
    append: <A>(fa: KApp<F, A>, fb: KApp<F, A>) => KApp<F, A>
}

export interface IMonoid<F> extends IMonoidBase<F> {
    foldMap<A, B>(as: A[], f: (a: A) => KApp<F, B>): KApp<F, B>
    concat<A>(fas: KApp<F, A>[]): KApp<F, A>
    join<A>(separator: KApp<F, A>): (fas: KApp<F, A>[]) => KApp<F, A>
    product<A>(as: KApp<F, A>[][]): KApp<F, A>[]
}

export function monoid<F>(base: IMonoidBase<F>): IMonoid<F> {
    const concat = <A>(fas: KApp<F, A>[]) => fas.reduce(base.append, base.empty<A>());
    const foldMap = <A, B>(as: A[], f: (a: A) => KApp<F, B>) => concat(as.map(f));

    const join = <A>(separator: KApp<F, A>) => (fas: KApp<F, A>[]) => {
        if (fas.length === 0)
            return base.empty<A>();

        const [head, ...tail] = fas;
        return tail.reduce((acc, a) => base.append(base.append(acc, separator), a), head);
    }

    const product = <A>(as: KApp<F, A>[][]): KApp<F, A>[] => as.reduce(array.lift2(base.append), array.unit(base.empty<A>()));

    return {
        empty: base.empty,        
        append: base.append,
        concat,
        foldMap,
        join,
        product
    }
}
