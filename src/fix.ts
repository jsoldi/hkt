// import { IFunctor, IFunctorBase, functor } from "./functor.js"
// import { $ } from "./hkt.js"
// import { pipe } from "./utils.js"

// export type Fix<G> = { unfix: $<G, Fix<G>> }

// export interface IFix<F> extends IFunctor<F> {
//     wrapFix(f: $<F, Fix<F>>): Fix<F>
//     unwrapFix(fx: Fix<F>): $<F, Fix<F>>
//     foldFix<A>(alg: (fa: $<F, A>) => A): (fix: Fix<F>) => A
//     unfoldFix<A>(alg: (fa: A) => $<F, A>): (a: A) => Fix<F>
//     hoistFix<G>(map: <A>(f: $<F, A>) => $<G, A>): (fx: Fix<F>) => Fix<G>
// }

// export function fix<F>(base: IFunctorBase<F>): IFix<F> {
//     return pipe(
//         base,
//         base => ({ ...functor(base), ...base }),
//         base => {
//             const wrapFix = (unfix: $<F, Fix<F>>): Fix<F> => ({ unfix });
//             const unwrapFix = ({ unfix }: Fix<F>): $<F, Fix<F>> => unfix;

//             const foldFix = <A>(alg: (fa: $<F, A>) => A) => function go({ unfix }: Fix<F>): A {
//                 return alg(base.map(unfix, go));
//             }

//             const unfoldFix = <A>(alg: (fa: A) => $<F, A>) => function go(a: A): Fix<F> {
//                 return { unfix: (base.map(alg(a), go)) };
//             }

//             const hoistFix = <G>(map: <A>(f: $<F, A>) => $<G, A>) => function go({ unfix }: Fix<F>): Fix<G> {
//                 return ({ unfix: map(base.map(unfix, go)) });
//             }

//             return {
//                 wrapFix,
//                 unwrapFix,
//                 foldFix,
//                 unfoldFix,
//                 hoistFix,
//                 ...base
//             }
//         }
//     );
// }
