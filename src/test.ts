// import { array, KArray } from "./array.js";
// import { Async, KAsync } from "./async.js";
// import { fix, Fix } from "./fix.js";
// import { fold } from "./foldable.js";
// import { functor, IFunctor } from "./functor.js";
// import { $, $3, $B, $I, KRoot } from "./hkt.js";
// import { maybe, Maybe } from "./maybe.js";
// import { IMonad } from "./monad.js";
// import { KPromise, promise } from "./promise.js";
// import { trivial } from "./trivial.js";
// import { tuple } from "./tuple.js";

// export interface KMaybePair extends KRoot {
//     readonly 0: unknown;
//     readonly 1: unknown;
//     readonly body: Maybe<[this[0], this[1]]>;
// }

// export interface KPromMaybePair extends KRoot {
//     readonly 0: unknown;
//     readonly 1: unknown;
//     readonly body: Promise<Maybe<[this[0], this[1]]>>;
// }

// const fixArray = <T>(arr: T[]): Fix<$<KMaybePair, T>> => {
//     return {
//         get unfix() {
//             if (arr.length === 0)
//                 return maybe.nothing;

//             return maybe.just<[T, Fix<$<KMaybePair, T>>]>([arr[0], fixArray(arr.slice(1))]);
//         }
//     }
// }

// const fixAsync = <T>(as: Async<T>): Fix<$<KPromMaybePair, T>> => {
//     const gen = as();

//     const rec = async (): Promise<Maybe<[T, Fix<$<KPromMaybePair, T>>]>> => {
//         const res = await gen.next();
//         let next: Promise<Maybe<[T, Fix<$<KPromMaybePair, T>>]>>;

//         if (res.done)
//             return maybe.nothing;

//         return maybe.just<[T, Fix<$<KPromMaybePair, T>>]>([res.value, {
//             get unfix() {
//                 if (!next)
//                     next = rec();

//                 return next;
//             }
//         }]);
//     }

//     return {
//         get unfix() {
//             return rec();
//         }
//     }
// }

// const unfixAsync = <T>(fx: Fix<$<KPromMaybePair, T>>): Async<T> => {
//     return async function* () {
//         let mt = await fx.unfix;

//         while (mt.right) {
//             const [t, fx] = mt.value;
//             yield t;
//             mt = await fx.unfix;
//         }
//     }
// }

// const unfixArray = <T>(fx: Fix<$<KMaybePair, T>>): T[] => {
//     const res: T[] = [];
//     let mt = fx.unfix;

//     while (mt.right) {
//         const [t, fx] = mt.value;
//         res.push(t);
//         mt = fx.unfix;
//     }

//     return res;
// }

// const as: Async<number> = async function* () {
//     yield 10;
//     yield 20;
//     yield 30;
//     yield 40;
// }

// const fixableArray = fold<KArray, $I>({
//     fixValue: fixArray,
//     unfixValue: unfixArray,
//     fixRoot: trivial
// });

// const fixableAsync = fold<KAsync, KPromise>({
//     fixValue: fixAsync,
//     unfixValue: unfixAsync,
//     fixRoot: promise
// });

// console.log(await fixableAsync.foldl((a, b) => `(${a} ${b})`)('()')(as));
// console.log(array.foldl((a, b) => `(${a} ${b})`)('()')([11, 21, 31, 41]));

// console.log(await fixableAsync.foldr((a, b) => `(${a} ${b})`)('()')(as));
// console.log(array.foldr((a, b) => `(${a} ${b})`)('()')([11, 21, 31, 41]));

// const test = unfixArray(fixArray([10, 20, 30, 40]));

// console.log(unfixArray(fixableArray.bind(fixArray([10, 20, 30, 40, 50, 60]), a => a % 20 ? fixArray([a.toString()]) : fixArray([]))));
