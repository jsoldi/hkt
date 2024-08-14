// import { KRoot } from "./hkt.js"
// import { IMonad, monad } from "./monad.js";

// export type Probs<T> = Map<T, number>

// export interface KProbs extends KRoot {
//     readonly 0: unknown
//     readonly body: Probs<this[0]>
// }

// export interface IProbs extends IMonad<KProbs> {
//     normalize: <A>(m: Probs<A>) => Probs<A>
//     uniform: <A>(...s: A[]) => Probs<A>
//     from: <A>(...tuples: [A, number][]) => Probs<A>
// }

// export const probs: IProbs = (() => {
//     const unit = <A>(t: A): Probs<A> => new Map([[t, 1]]);

//     const bind = <A, B>(m: Probs<A>, f: (a: A) => Probs<B>): Probs<B> => {
//         const result = new Map<B, number>();

//         for (const [a, p] of normalize(m)) {
//             for (const [b, q] of normalize(f(a))) {
//                 result.set(b, (result.get(b) || 0) + p * q);
//             }
//         }

//         return normalize(result);
//     }

//     const normalize = <A>(m: Probs<A>): Probs<A> => {
//         const total = [...m.values()].reduce((acc, p) => acc + p, 0);
//         return new Map([...m].map(([a, p]) => [a, p / total]));
//     }

//     const from = <A>(...tuples: [A, number][]): Probs<A> => normalize(new Map(tuples));

//     const uniform = <A>(...s: A[]): Probs<A> => {
//         const p = 1 / s.length;
//         return new Map(s.map(a => [a, p]));
//     }

//     return {
//         ...monad<KProbs>({ unit, bind }),
//         normalize,
//         uniform,
//         from
//     };
// })();
