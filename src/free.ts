// import { KApp, KRoot } from "./hkt.js";
// import { IMonad, monad } from "./monad.js";
// import { ITransMonad, KTransform } from "./transform.js";

// export enum FreeOp {
//     Unit = 1,
//     Bind = 2
// }

// export interface FreeUnit<out T> {
//     readonly type: FreeOp.Unit
//     readonly value: T
// }

// export interface FreeBind<out T> {
//     readonly type: FreeOp.Bind
//     readonly read: <R>(reader: <S>(left: Free<S>, map: (s: S) => Free<T>) => R) => R
// }

// export type Free<T> = FreeUnit<T> | FreeBind<T>

// export interface KFree extends KRoot {
//     readonly 0: unknown
//     readonly body: Free<this[0]>
// }

// export interface IFree extends ITransMonad<KFree> {
//     to: <F>(monad: IMonad<F>) => <T>(fm: Free<T>) => KApp<F, T>
//     run: <T>(monad: Free<T>) => T
// }

// export const free: IFree = (() => {
//     const unit = <A>(value: A): Free<A> => ({ type: FreeOp.Unit, value });

//     const bind = <A, B>(left: Free<A>, map: (a: A) => Free<B>): Free<B> => ({
//         type: FreeOp.Bind,
//         read: reader => reader(left, map)
//     });

//     const to = <F>(monad: IMonad<F>) => {
//         return function freeItem<T>(fm: Free<T>): KApp<F, T> {
//             if (fm.type === FreeOp.Unit) {
//                 return monad.unit(fm.value);
//             } else {
//                 return fm.read((left, map) => monad.bind(freeItem(left), s => freeItem(map(s))));
//             }
//         };
//     }

//     const run = <T>(_head: Free<T>): T => {
//         let head: Free<unknown> = _head;
//         const list: FreeBind<unknown>[] = [];

//         while (true) {
//             if (head.type === FreeOp.Unit) {
//                 const top = list.pop();

//                 if (top === undefined) {
//                     return head.value as T;
//                 }
//                 else {
//                     const value = head.value;
//                     head = top.read(<S>(_: Free<S>, map: (s: S) => Free<unknown>) => map(value as S));
//                 }
//             }
//             else {
//                 list.push(head);
//                 head = head.read(left => left);
//             }
//         }
//     }

//     const transform = <F>(outer: IMonad<F>) => {
//         const lift = <A>(a: KApp<F, A>): KApp<F, Free<A>> => outer.map(a, m.unit);

//         const mt = monad<KApp<KTransform<KFree>, F>>({
//             unit: <A>(a: A): KApp<F, Free<A>> => outer.unit(m.unit(a)),
//             bind: <A, B>(ffa: KApp<F, Free<A>>, f: (a: A) => KApp<F, Free<B>>): KApp<F, Free<B>> =>
//                 outer.bind(ffa, fa => outer.bind(to(outer)(fa), f))
//         });

//         return { ...mt, lift };
//     }

//     const m = monad<KFree>({ unit, bind });

//     return {
//         ...m,
//         run,
//         to,
//         transform
//     }
// })();
