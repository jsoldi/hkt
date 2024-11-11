// import { $, KRoot } from "./hkt.js"
// import { IMonad, monad } from "./monad.js";

// export interface KMap<S> extends KRoot {
//     readonly 0: unknown
//     readonly body: Map<S, this[0]>
// }

// export interface IMap<S> extends IMonad<KMap<S>> {
// }

// function map<S>(set: Set<S>): IMap<S> {
//     const unit = <A>(a: A): Map<S, A> => new Map([...set].map(s => [s, a]));

//     const bind = <A, B>(m: Map<S, A>, f: (a: A) => Map<S, B>): Map<S, B> => {
//         return new Map([...m].map(([s, a]) => [s, f(a).get(s)!]));

//     }
// }
