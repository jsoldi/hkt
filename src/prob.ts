// import { KRoot } from "./hkt.js"
// import { IMonad, monad } from "./monad.js";

// /**
//  * This is an "inverse" Giry monad. We can represent any probability as its
//  * inverse CDF function (or "quantile function"). This is a function that takes
//  * a value in [0,1] and returns a value.
//  * It's also, I think, a more natural way to think about probabilities in terms
//  * of possible worlds, which also maybe aligns better with the way the Set 
//  * category works. Note that this is just a special case of the reader monad.
//  */
// export type Prob<T> = {
//     sample: (world: number) => T
//     prob: (value: T) => number
// }

// export interface KProb extends KRoot {
//     readonly 0: unknown
//     readonly body: Prob<this[0]>
// }

// export interface IProb extends IMonad<KProb> {
// }

// export const prob: IProb = (() => {
//     const unit = <A>(t: A): Prob<A> => ({
//         sample: _ => t,
//         prob: v => v === t ? 1 : 0
//     });

//     const bind = <A, B>(m: Prob<A>, f: (a: A) => Prob<B>): Prob<B> => {}

//     const uniform = <T>(...values: T[]): Prob<T> => w => {
//         return values[Math.floor(w * values.length)];
//     }        

//     const sample = <T>(m: Prob<T>): T => m(Math.random());

// })();
