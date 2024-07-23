// import { KApp, KRoot } from "./hkt.js";
// import { IMonad, monad } from "./monad.js";
// import { ITransform, KTransform } from "./transform.js";

// export type Either<L, R = never> = readonly [true, L] | [false, R]

// export interface KEither extends KRoot {
//     readonly 0: unknown
//     readonly body: Either<this[0], never>
// }

// export const either: IMonad<KEither> = (() => {
//     const left = <A>(a: A): Either<A, never> => [true, a];
//     const right = <A>(a: A): Either<never, A> => [false, a];
//     const swap = <A, B>(fa: Either<A, B>): Either<B, A> => fa[0] ? right(fa[1]) : left(fa[1]);
//     const match = <A, B, C>(onLeft: (a: A) => C, onRight: (b: B) => C) => (fa: Either<A, B>): C => fa[0] ? onLeft(fa[1]) : onRight(fa[1]);

//     const _try: {
//         <A, B>(onTry: () => A, onCatch: (e: unknown) => B): Either<A, B>
//         <A>(onTry: () => A): Either<A, unknown>
//      } = <A, B>(onTry: () => A, onCatch?: (e: unknown) => B) => {
//         try {
//             return left(onTry());
//         } catch (e) {
//             return right(onCatch?.(e) ?? e);
//         }
//     }

//     const tryAsync: {
//         <A, B>(onTry: () => A, onCatch: (e: unknown) => B): Promise<Either<Awaited<A>, Awaited<B>>>
//         <A>(onTry: () => Promise<A>): Promise<Either<Awaited<A>, unknown>>
//     } = async <A, B>(onTry: () => A, onCatch?: (e: unknown) => B) => {
//         try {
//             return left(await onTry());
//         } catch (e) {
//             return right(await onCatch?.(e) ?? e);
//         }
//     };

//     const transform = <F>(outer: IMonad<F>): ITransform<F, KTransform<KEither>> => {
//         const lift = <A>(a: KApp<F, A>): KApp<F, Either<A>> => outer.map(a, left<A>);

//         const m = monad<KApp<KTransform<KEither>, F>>({
//             unit: <A>(a: A): KApp<F, Either<A>> => outer.unit(left<A>(a)),
//             bind: <A, B>(fa: KApp<F, Either<A>>, f: (a: A) => KApp<F, Either<B>>): KApp<F, Either<B>> =>
//                 outer.bind(fa, match(f, r => outer.unit(right(r))))
//         });

//         return { ...m, lift };
//     };

//     const m = monad<KEither>({
//         unit: left,
//         bind: (fa, f) => fa[0] ? f(fa[1]) : fa
//     });

//     return { left, right, swap, match, try: _try, tryAsync, ...m };
// })();

// export type Maybe<T> = Either<T, void>

// export interface KMaybe extends KRoot {
//     readonly 0: unknown
//     readonly body: Maybe<this[0]>
// }

// export interface IMaybe extends IMonad<KMaybe> {
//     just: <A>(a: A) => Maybe<A>
//     nothing: <A>() => Maybe<A>
//     match: <A, B, C>(onJust: (a: A) => B, onNothing: () => C) => (fa: Maybe<A>) => B | C
// }

// const maybe = (() => {
//     const just = <A>(a: A): Maybe<A> => [true, a];
//     const nothing = <A>(): Maybe<A> => [false, undefined];
//     const match = <A, B, C>(onJust: (a: A) => B, onNothing: () => C) => (fa: Maybe<A>): B | C => fa[0] ? onJust(fa[1]) : onNothing();

//     const _try: <A>(onTry: () => A) => Maybe<A> = <A>(onTry: () => A) => {
//         try {
//             return just(onTry());
//         } catch (e) {
//             return nothing();
//         }
//     }

//     const tryAsync: <A>(onTry: () => Promise<A>) => Promise<Maybe<A>> = async <A>(onTry: () => Promise<A>) => {
//         try {
//             return just(await onTry());
//         } catch (e) {
//             return nothing();
//         }
//     }

//     const m = monad<KMaybe>({
//         unit: just,
//         bind: (fa, f) => fa[0] ? f(fa[1]) : nothing()
//     });

//     return {
//         just,
//         nothing,
//         match,
//         try: _try,
//         tryAsync,
//         ...m
//     }
// })();