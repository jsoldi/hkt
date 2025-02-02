// import { array, KArray } from "./array.js";
// import { async } from "./async.js";
// import { either, Either, KEither, Left, Right } from "./either.js";
// import { functor, IFunctor, IFunctorBase } from "./functor.js";
// import { $, $3, $4, $B, $B1, $B2, ITypeClass, KRoot } from "./hkt.js";
// import { KMaybe, Maybe, maybe } from "./maybe.js";
// import { IMonad, monad } from "./monad.js";
// import { MonadFree, monadFree } from "./monadFree.js";
// import { string } from "./primitive.js";
// import { KPromise, promise } from "./promise.js";
// import { reader } from "./reader.js";
// import { trivial } from "./trivial.js";
// import { KTuple, tuple } from "./tuple.js";
// import { chain, id, pipe } from "./utils.js";

// import { num, string } from "./primitive.js";
// import { tuple } from "./tuple.js";

// const maybeCata = (() => {
//     const ini = (m: Maybe<number>): number => maybe.isNothing(m) ? 0 : m.value + 1;

//     const cata = <B>(g: (m: Maybe<B>) => B) => (n: number): B => {
//         const self: (n: number) => B = cata(g);

//         if (n === 0) {
//             const may: Maybe<number> = maybe.nothing;
//             const lel: Maybe<B> = maybe.map(may, self); // nothing
//             const b: B = g(lel);
//             return b;
//         } else {
//             const may: Maybe<number> = maybe.just(n - 1);
//             const lel: Maybe<B> = maybe.map(may, self); // just
//             const b: B = g(lel);
//             return b;
//         }
//     }

//     return { ini, cata };
// })();

// // const g = (m: Maybe<string>) => maybe.isNothing(m) ? "go!" : `wait... ${m.value}`;
// // const test = cata(ini)(43);
// // console.log(test);

// interface KProd extends KRoot {
//     readonly 0: unknown;
//     readonly 1: unknown;
//     readonly body: [this[0], this[1]];
// }

// interface IProd extends IFunctor<$<KProd, unknown>> {
//     map<A, B, T>(fa: [T, A], f: (a: A) => B): [T, B]
// }

// const lel: IProd = {
//     ...functor<$<KProd, unknown>>({
//         map: <A, B, T>(fa: [T, A], f: (a: A) => B): [T, B] => [fa[0], f(fa[1])]
//     }),
//     map: <A, B, T>(fa: [T, A], f: (a: A) => B): [T, B] => [fa[0], f(fa[1])]
// }

// const reats = lel.map([10, 'caca'], c => !!c.length);

// interface KMaybeProd<L> extends KRoot {
//     readonly 0: unknown;
//     readonly body: Maybe<[L, this[0]]>;
// }

// export interface IFunctorBase2<F> {
//     map<A, B, Z = never>(fa: $3<F, Z, A>, f: (a: A) => B): $3<F, Z, B>
// }

// export interface IFunctor2<F> extends IFunctorBase2<F> {
//     fmap<A, B>(f: (a: A) => B): <T = never>(fa: $3<F, T, A>) => $3<F, T, B>
// }

// export function func<F>(base: IFunctorBase2<F>): IFunctor2<F> {
//     const fmap = <A, B>(f: (a: A) => B) => <T = never>(fa: $3<F, T, A>): $3<F, T, B> => base.map(fa, f);

//     return {
//         fmap,
//         ...base
//     }
// }

// interface KKMaybeProd extends KRoot {
//     readonly 0: unknown;
//     readonly 1: unknown;
//     readonly body: Maybe<[this[0], this[1]]>;
// }

// const mp = functor<$<KKMaybeProd, any>>({
//     map: null as any
// });

// function maybeProd<L>() {
//     const base = functor<KMaybeProd<L>>({
//         map: <A, B>(fa: Maybe<[L, A]>, f: (a: A) => B) => maybe.map(fa, ([l, a]) => [l, f(a)])
//     });

//     const ini = <L>(m: Maybe<[L, L[]]>): L[] => maybe.isNothing(m) ? [] : [m.value[0], ...m.value[1]];

//     const cata = <B>(g: (m: Maybe<[L, B]>) => B) => (l: L[]): B => {
//         const self: (ls: L[]) => B = cata(g);

//         if (l.length === 0) {
//             const shit: Maybe<[L, L[]]> = maybe.nothing;
//             const lel: Maybe<[L, B]> = base.map<L[], B>(shit, self); // nothing
//             const b: B = g(lel);
//             return b;
//         } else {
//             const shit: Maybe<[L, L[]]> = maybe.just([l[0], l.slice(1)]);
//             const lel: Maybe<[L, B]> = base.map<L[], B>(shit, self); // just
//             const b: B = g(lel);
//             return b;
//         }
//     }

//     return {
//         ini,
//         cata,
//         ...base
//     }
// }

// // const mp = maybeProd<string>();
// // const ratos = mp.cata(maybe.maybe('- ', ([a, b]) => `(${a} ${b})`));
// // const tests = ratos(['a', 'b', 'c']);
// // console.log(tests);

// type Algebra<F, A> = (fa: $<F, A>) => A;

// type Fix<F> = { invIso: $<F, Fix<F>> };

// interface KFix extends KRoot {
//     readonly 0: unknown
//     readonly body: Fix<this[0]>
// }

// const cata = <F, G, T>(f: IFunctor2<F>, inv: (g: $<G, T>) => $<$<F, T>, $<G, T>>) => <A>(alg: (fa: $<$<F, T>, A>) => A) => function self(g: $<G, T>): A {
//     const ftgt = inv(g);
//     const rat = f.map(ftgt, self);
//     const papa = alg(rat);
//     return papa;
//     // return pipe(
//     //     g,
//     //     inv,
//     //     //invIso,                     // Fix<F> => $<F, Fix<F>>
//     //     f.fmap<$<G, T>, A>(self),    // $<F, Fix<F>> => $<F, A>
//     //     alg                         // $<F, A> => A
//     // ); // $<F, Fix<F>> => $<F, A> => A
// }

// // type KEitherL<L> = $<KEither, L>;

// // const zero = <L>(l: L): Fix<KEitherL<L>> => ({ invIso: either.monad<L>().left(l) });
// // const successor = <L>(nat: Fix<KEitherL<L>>): Fix<KEitherL<L>> => ({ invIso: maybe.just(nat) });

// // const pleaseWait: Algebra<KEitherL<number>, string> = (fa: Either<number, string>) => {
// //     return either.isLeft(fa) ? `[n: ${fa.value}]` : `> ${fa.value}`;
// // }

// // const ratas = cata<KEitherL<number>, Fix<KEitherL<number>>>(either.monad<number>(), a => a.invIso)(pleaseWait)(pipe(zero(123), successor, successor, successor, successor));
// // console.log(ratas);

// //--------------------------------------------------------------

// const empty: Fix<KMaybeProd<never>> = { invIso: maybe.nothing };
// const cons = <A>(head: A, tail: Fix<KMaybeProd<A>>): Fix<KMaybeProd<A>> => ({ invIso: maybe.just([head, tail]) });

// const listAlg = (p: Maybe<[string, number]>): number => maybe.isNothing(p) ? 0 : p.value[0].length + p.value[1];

// const test = <T>(list: T[]): Maybe<[T, T[]]> => {
//     return list.length === 0 ? maybe.nothing : maybe.just([list[0], list.slice(1)]);
// }

// const rats = cata<KKMaybeProd, KArray, string>(
//     mp,
//     test
// )(listAlg)(['a', 'bb', 'ccc']);

// console.log(rats);
// //console.log(JSON.stringify(cons('a', cons('b', empty)), null, 2));

// //--------------------------------------------------------------

// // interface KPromMaybePair<L> extends KRoot {
// //     readonly 0: unknown;
// //     readonly body: Promise<Maybe<[L, this[0]]>>;
// // }

// // const pmp = function<L>() {
// //     return functor<KPromMaybePair<L>>({
// //         map: <A, B>(fa: Promise<Maybe<[L, A]>>, f: (a: A) => B): Promise<Maybe<[L, B]>> => 
// //             promise.map(fa, maybe.fmap(([l, a]) => [l, f(a)]))
// //     });
// // }

// // const empty: Fix<KPromMaybePair<never>> = { invIso: promise.unit(maybe.nothing) };

// // const cons = <A>(head: A, tail: Fix<KPromMaybePair<A>>): Fix<KPromMaybePair<A>> => 
// //     ({ invIso: promise.unit(maybe.just([head, tail])) });

// // const pmpAlg: Algebra<KPromMaybePair<string>, Promise<number>> = async (p: Promise<Maybe<[string, Promise<number>]>>): Promise<number> => {
// //     const _p = await p;
// //     // await new Promise(resolve => setTimeout(resolve, 1000));
    
// //     if (_p.right) {
// //         const [l, n] = _p.value;
// //         const _n = await n;
// //         return _n + l.length;
// //     } {
// //         return 10000;
// //     }
// // }

// // const rats = await cata(pmp<string>())(pmpAlg)(cons('abc', cons('defg', empty)));
// // console.log(rats);

//--------------------------------------------------------------

// const tramp = tuple.monoid(num.sum, string);

// tramp.append([1, 'awef'], [3, 'awefwef']);

