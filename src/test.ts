// import { array, KArray } from "./array.js";
// import { IFoldBase, fold } from "./fold.js";
// import { gen } from "./gen.js";
// import { $, $I, $K } from "./hkt.js";
// import { IMonadBase } from "./monad.js";
// import { IMonoid } from "./monoid.js";
// import { object } from "./object.js";
// import { num } from "./primitive.js";
// import { set } from "./set.js";
// import { tuple } from "./tuple.js";
// import { chain, pipe } from "./utils.js";

// export interface IFoldEx<F, G> extends IFoldBase<F, G> {
//     average<T, R>(m: IMonoid<$<$K, T>>, divide: (sum: T, count: number) => R): (ft: $<F, T>) => $<G, R>
//     measures(st: $<F, keyof any>): $<G, Record<keyof any, number>>
// }

// function foldEx<F, G>(_base: IFoldBase<F, G> & IMonadBase<F>) {
//     type I = IFoldEx<F, G>;
//     const base = fold(_base);

//     const average: I['average'] = <T, R>(m: IMonoid<$<$K, T>>, divide: (sum: T, count: number) => R) => (ft: $<F, T>) => {
//         const pm = tuple<T>().monoid(m, num.sum);
//         const ftp = base.map<T, [T, number]>(ft, t => [t, 1]);
//         const rats = base.collapse(pm)(ftp);
//         return base.scalar.map(rats, ([sum, count]) => divide(sum, count));
//     }    

//     const measures: I['measures'] = chain(
//         base.fmap(key => [1, ({ [key]: 1 })] satisfies [unknown, unknown]),
//         base.collapse(tuple<number>().monoid(num.sum, object.monoid(num.sum))),
//         base.scalar.fmap(([count, result]) => object.map(result, n => n / count))
//     );

//     return {
//         average,
//         measures,
//     }
// }