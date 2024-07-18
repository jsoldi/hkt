// import { KArray } from "./array.js"
// import { KApp } from "./hkt.js"
// import { IMonadBase } from "./monad.js"

// export interface IMonoidBase<F> extends IMonadBase<F> {
//     empty<T = never>(): KApp<F, T>
//     concat<A, B>(a: KApp<F, A>, b: KApp<F, B>): KApp<F, A | B>
// }

// interface IMonoid<F> extends IMonoidBase<F> {
//     repeat(length: number): <T>(value: KApp<F, T>) => KApp<F, T>
//     filter<T>(predicate: (value: T) => boolean): (value: KApp<F, T>) => KApp<F, T>
//     filter<T, S extends T>(predicate: (value: T) => value is S): (value: KApp<F, T>) => KApp<F, S>
// }

// export function monoid<F>(base: IMonoidBase<F>): IMonoid<F> {
//     const repeat = (length: number) => <T>(value: KApp<F, T>) =>
//         Array.from({ length }, () => value).reduce((acc, cur) => base.concat(acc, cur), base.empty<T>());

//     const filter = <T>(predicate: (value: T) => boolean) => (value: KApp<F, T>) =>
//         base.bind(value, v => predicate(v) ? base.unit(v) : base.empty<T>());

//     return {
//         ...base,
//         repeat,
//         filter
//     }
// }

// const arrayMonoid: IMonoidBase<KArray> = {
//     empty: () => [],
//     concat: (a, b) => a.concat(b)
// }
