// import { IFunctor } from "./functor.js";
// import { $ } from "./hkt.js";
// import { pipe } from "./utils.js";

// export interface ICataBase<F, G> {
//     readonly fix: IFunctor<G>
//     project<A>(fa: $<F, A>): $<G, A>
// }

// export function cata<F, G>(base: ICataBase<F, G>) {
//     const foldr = <A>(alg: (fa: $<G, A>) => A) => function self(fa: $<F, A>): A {
//         const lol = pipe(
//             // fuck shit
//             fa,
//             base.project,
//             //base.fix.fmap(self)
//         );
//     }
// }
