// import { KApp, KRoot } from "./hkt.js";
// import { IMonad, monad } from "./monad.js";

// export type Cont<T> = <R>(handle: (a: T) => Cont<R>) => Cont<R>

// export interface KCont extends KRoot {
//     readonly 0: unknown
//     readonly body: Cont<this[0]>
// }

// export interface ICont extends IMonad<KCont> {
//     delay: (ms: number) => Cont<void>
//     from: <T>(f: Promise<T> | (() => Promise<T>)) => Cont<T>
//     unit: <A>(a: A) => Cont<A>
// }

// export const cont: ICont = (() => {
//     const unit: <A>(a: A) => Cont<A> = a => handle => handle(a);
//     const bind: <A, B>(fa: Cont<A>, f: (a: A) => Cont<B>) => Cont<B> = (fa, f) => handle => fa(a => f(a)(handle));

//     const delay: (ms: number) => Cont<void> = ms => handleVoid => {
//         return handleR => {
//             return handleVoid(undefined)(handleR);
//         }

//         // setTimeout(() => handleVoid(undefined), ms);
//     };

//     const from: <T>(f: Promise<T> | (() => Promise<T>)) => Cont<T> = f => handle => (async () => handle(await (typeof f === 'function' ? f() : f)))();

//     const contMonad = monad<KCont>({ 
//         unit,
//         bind,
//     });

//     return {
//         delay,
//         from,
//         ...contMonad,
//         unit,
//         bind
//     }
// })();

// const loco = cont.unit(123);
// const aver = loco(a => a);
