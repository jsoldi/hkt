import { $, $Q, KRoot } from "./hkt.js"
import { IMonad, monad } from "./monad.js"
import { ITransformer, monadTrans } from "./transformer.js"
import { pipe } from "./utils.js"

export interface Left<out L> {
    readonly right: false
    readonly value: L
}

export interface Right<out R> {
    readonly right: true
    readonly value: R
}

export type Either<L, R> = Left<L> | Right<R>

export interface KEither extends KRoot {
    readonly 0: unknown
    readonly 1: unknown
    readonly body: Either<this[0], this[1]>
}

export type KEitherTrans<L> = $<$Q, $<KEither, L>>

export interface IEither {
    right<B>(b: B): Right<B>;
    left<A>(a: A): Left<A>;
    either<A, B, C, D = C>(onLeft: (a: A) => C, onRight: (b: B) => D): (fa: Either<A, B>) => C | D;
    lefts<A, B>(fa: Either<A, B>[]): A[];
    rights<A, B>(fa: Either<A, B>[]): B[];
    isLeft<A, B>(fa: Either<A, B>): fa is Left<A>;
    isRight<A, B>(fa: Either<A, B>): fa is Right<B>;
    fromLeft<C>(a: C): <A, B>(fa: Either<A, B>) => A | C;
    fromRight<C>(b: C): <A, B>(fa: Either<A, B>) => B | C;
    partition<A, B>(fa: Either<A, B>[]): { lefts: A[], rights: B[] };
    try<T, E>(onTry: () => T, onCatch: (e: unknown) => E): Either<E, T>;
    try<T>(onTry: () => T): Either<unknown, T>;
    tryAsync<T, E>(onTry: () => T, onCatch: (e: unknown) => E): Promise<Either<Awaited<E>, Awaited<T>>>;
    tryAsync<T>(onTry: () => T): Promise<Either<unknown, Awaited<T>>>;
    throwLeft<B>(fa: Either<unknown, B>): B;
    throwRight<A>(fa: Either<A, unknown>): A;
    monad<L>(): IEitherMonad<L>
}

// Same as IEither but with fixed left type set to L
export interface IEitherMonad<L> extends IMonad<$<KEither, L>>, ITransformer<KEitherTrans<L>> {
    right<R>(a: R): Right<R>
    left(l: L): Left<L>
    either<R, C, D = C>(onLeft: (a: L) => C, onRight: (b: R) => D): (fa: Either<L, R>) => C | D
    lefts<R>(fa: Either<L, R>[]): L[]
    rights<R>(fa: Either<L, R>[]): R[]
    isLeft<R>(fa: Either<L, R>): fa is Left<L>
    isRight<R>(fa: Either<L, R>): fa is Right<R>
    fromLeft<C>(a: C): <R>(fa: Either<L, R>) => L | C
    fromRight<C>(b: C): <R>(fa: Either<L, R>) => R | C
    partition<R>(fa: Either<L, R>[]): { lefts: L[], rights: R[] }
    try<R>(onTry: () => R, onCatch: (e: unknown) => L): Either<L, R>
    tryAsync<R>(onTry: () => R, onCatch: (e: unknown) => L): Promise<Either<L, R>>
    throwLeft<R>(fa: Either<L, R>): R
    throwRight<R>(fa: Either<L, R>): L
}

function eitherMonad<L>(): IEitherMonad<L> {    
    return pipe(
        monad<$<KEither, L>>({
            unit: either.right,
            bind: (fa, f) => fa.right ? f(fa.value) : fa,
        }),
        base => {
            const transform = <M>(outer: IMonad<M>) => {
                type KType = $<KEitherTrans<L>, M>;
                
                return monadTrans<KEitherTrans<L>, M>({ 
                    map: (fa, f) => outer.map(fa, a => base.map(a, f)),
                    unit: <A>(a: A) => outer.unit<Either<L, A>>(either.right(a)), 
                    bind: <A, B>(fa: $<KType, A>, f: (a: A) => $<KType, B>): $<KType, B> =>
                        outer.bind(fa, a => a.right ? f(a.value) : outer.unit<Either<L, B>>(either.left(a.value))),
                    lift: <A>(a: $<M, A>) => outer.map<A, Either<L, A>>(a, either.right)
                });
            };

            return {
                transform,
                ...base
            }
        },
        base => {
            return {
                ...base,
                ...either
            };
        }
    )
}

export const either: IEither = (() => {
    return {
        right: (b) => ({ right: true, value: b }),
        left: (a) => ({ right: false, value: a }),
        either: (onLeft, onRight) => (fa) => fa.right ? onRight(fa.value) : onLeft(fa.value),
        lefts: <A, B>(fa: Either<A, B>[]) => {
            const result = [] as A[];

            for (const a of fa) {
                if (!a.right)
                    result.push(a.value);
            }

            return result;
        },
        rights: <A, B>(fa: Either<A, B>[]) => {
            const result = [] as B[];

            for (const a of fa) {
                if (a.right)
                    result.push(a.value);
            }

            return result;
        },
        isLeft: <A, B>(fa: Either<A, B>): fa is Left<A> => !fa.right,
        isRight: <A, B>(fa: Either<A, B>): fa is Right<B> => fa.right,
        fromLeft: <C>(a: C) => <A, B>(fa: Either<A, B>) => fa.right ? a : fa.value,
        fromRight: (b) => (fa) => fa.right ? fa.value : b,
        partition: <A, B>(fa: Either<A, B>[]) => {
            const result = { lefts: [] as A[], rights: [] as B[] };

            for (const a of fa) {
                if (a.right)
                    result.rights.push(a.value);
                else
                    result.lefts.push(a.value);
            }

            return result;
        },
        try: <T, E>(onTry: () => T, onCatch?: (e: unknown) => E) => {
            try {
                return either.right(onTry());
            } catch (e) {
                return either.left(onCatch?.(e) ?? e);
            }
        },
        tryAsync: async <T, E>(onTry: () => T, onCatch?: (e: unknown) => E) => {
            try {
                return either.right(await onTry());
            } catch (e) {
                return either.left(await onCatch?.(e) ?? e);
            }
        },
        throwLeft: <B>(fa: Either<unknown, B>) => {
            if (!fa.right)
                throw fa.value;

            return fa.value;
        },
        throwRight: <A>(fa: Either<A, unknown>) => {
            if (fa.right)
                throw fa.value;

            return fa.value;
        },
        monad: eitherMonad
    }
})();
