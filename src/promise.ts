// import { array as minArray } from "./array.js";
// import { KRoot } from "./hkt.js";
// import { IMonad, monad } from "./monad.js";

// export interface KPromise extends KRoot {
//     readonly 0: unknown
//     readonly body: Promise<this[0]>
// }

// export interface IPromise extends IMonad<KPromise> {
//     delay: (ms: number) => Promise<void>
// }

// declare const trageto: Promise<Promise<number>>;

// trageto.then(a => a)

// export const promise: IPromise = (() => {
//     const unit: <A>(a: A) => Promise<A> = a => Promise.resolve(a);

//     const bind: <A, B>(fa: Promise<A>, f: (a: A) => Promise<B>) => Promise<B> = (fa, f) => {
//         return fa.then(f); 
//     }

//     const delay: (ms: number) => Promise<void> = ms => new Promise(resolve => setTimeout(resolve, ms));

//     const m = monad<KPromise>({ 
//         unit,
//         bind,
//     });

//     return {
//         delay,
//         ...m
//     }
// })();

// export const array = (() => {
//     const filter: {
//         <T, S extends T>(predicate: (item: T) => item is S): (items: T[]) => S[];
//         <T>(predicate: (item: T) => boolean): (items: T[]) => T[];
//     } = <T, S extends T>(predicate: (item: T) => any): (items: T[]) => T[] | S[] => {
//         return (items: T[]) => items.filter(predicate);
//     };
    
//     return {
//         ...minArray,
//         reverse: <T>(items: T[]) => {
//             const result = [...items];
//             result.reverse();
//             return result;
//         },
//         filter,
//     };    
// })();


// const tp = array.transform(promise);

// const lala = tp.unit(123);

// const lel = promise.pipe(
//     Promise.resolve([123, 456]),
//     rat => promise.unit(rat)
// )
