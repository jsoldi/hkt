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

interface IEitherCore {
    of<T>(): IEither<T>;
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
}

// Same as IEither but with fixed left type set to L
export interface IEither<L = any> extends IEitherCore, IMonad<$<KEither, L>>, ITransformer<KEitherTrans<L>> { }

const core: IEitherCore = {
    of: () => eitherOf(),
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
            return core.right(onTry());
        } catch (e) {
            return core.left(onCatch?.(e) ?? e);
        }
    },
    tryAsync: async <T, E>(onTry: () => T, onCatch?: (e: unknown) => E) => {
        try {
            return core.right(await onTry());
        } catch (e) {
            return core.left(await onCatch?.(e) ?? e);
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
    }
}

function eitherOf<L>(): IEither<L> {
    return pipe(
        core,
        base => ({
            ...monad<$<KEither, L>>({
                unit: base.right,
                bind: (fa, f) => fa.right ? f(fa.value) : fa,
            }),
            ...base
        }),
        base => ({
            transform: <M>(outer: IMonad<M>) => {
                type KType = $<KEitherTrans<L>, M>;

                return monadTrans<KEitherTrans<L>, M>({
                    map: (fa, f) => outer.map(fa, a => base.map(a, f)),
                    unit: <A>(a: A) => outer.unit<Either<L, A>>(base.right(a)),
                    bind: <A, B>(fa: $<KType, A>, f: (a: A) => $<KType, B>): $<KType, B> =>
                        outer.bind(fa, a => a.right ? f(a.value) : outer.unit<Either<L, B>>(base.left(a.value))),
                    lift: <A>(a: $<M, A>) => outer.map<A, Either<L, A>>(a, base.right)
                });
            },
            ...base
        })
    )
}

export const either = eitherOf<any>();
