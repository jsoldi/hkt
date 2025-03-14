import { $, $Q, KRoot } from "../core/hkt.js"
import { pipe } from "../core/utils.js"
import { IMonad, monad } from "../classes/monad.js"
import { ISemigroup } from "../classes/monoid.js"
import { ITransformer, monadTrans } from "../classes/transformer.js"
import { Lazy } from "./lazy.js"

/** The left side of an `Either`. */
export interface Left<out L> {
    readonly right: false
    readonly value: L
}

/** The right side of an `Either`. */
export interface Right<out R> {
    readonly right: true
    readonly value: R 
}

/** The `Either` type, also known as a union or sum type, representing a value that can be one of two types. */
export type Either<L, R> = Left<L> | Right<R>

export interface KEither1<L> extends KRoot {
    readonly 0: unknown
    readonly body: Either<L, this[0]>
}

/** The higher-kinded type of `Either`, representing a value that can be one of two types. */
export interface KEither extends KRoot {
    readonly 0: unknown
    readonly body: KEither1<this[0]>
}

/** The higher-kinded type of the either transformer */
export type KEitherTrans<L> = $<$Q, $<KEither, L>>

/** The either interface, providing a set of functions for working with `Either` types. */
interface IEitherCore {
    /** Creates an `either` module with a fixed left type. */
    of<T>(): IEither<T>;
    /** Creates a right `Either` value. */
    right<B>(b: B): Right<B>;
    /** Creates a left `Either` value. */
    left<A>(a: A): Left<A>;
    /** Applies one of two functions to the value of an `Either`. */
    either<A, B, C, D = C>(onLeft: (a: A) => C, onRight: (b: B) => D): (fa: Either<A, B>) => C | D;
    /** Maps over the value of an `Either`. */
    bimap<A, B, C, D = C>(onLeft: (a: A) => C, onRight: (b: B) => D): (fa: Either<A, B>) => Either<C, D>;
    /** Extracts the left values from an array of `Either` values. */
    lefts<A, B>(fa: Either<A, B>[]): A[];
    /** Extracts the right values from an array of `Either` values. */
    rights<A, B>(fa: Either<A, B>[]): B[];
    /** Returns `fa` if it is a right, otherwise returns `b`. */
    or<B>(b: B): <L, A>(fa: Either<L, A>) => Either<L, A> | B;
    /** Returns `b` if `fa` is a right, otherwise returns `fa`. */
    and<B>(b: B): <L, A>(fa: Either<L, A>) => Either<L, A> | B;
    /** Returns the value of `fa` if it is a right, otherwise returns the value of `b`. */
    else<B>(b: Lazy<B>): <L, A>(fa: Either<L, A>) => A | B;
    /** Returns `true` if `fa` is a left, otherwise returns `false`. */
    isLeft<A, B>(fa: Either<A, B>): fa is Left<A>;
    /** Returns `true` if `fa` is a right, otherwise returns `false`. */
    isRight<A, B>(fa: Either<A, B>): fa is Right<B>;
    /** Extracts the left value from an `Either`, or returns a default value. */
    fromLeft<C>(a: C): <A, B>(fa: Either<A, B>) => A | C;
    /** Extracts the right value from an `Either`, or returns a default value. */
    fromRight<C>(b: C): <A, B>(fa: Either<A, B>) => B | C;
    /** Partitions an array of `Either` values into left and right values. */
    partition<A, B>(fa: Either<A, B>[]): { lefts: A[], rights: B[] };
    /** Executes a function that may throw an error, catching the error and returning an `Either` where the left side contains the error. */
    try<T, E>(onTry: () => T, onCatch: (e: unknown) => E): Either<E, T>;
    /** Executes a function that may throw an error, catching the error and returning an `Either` where the left side contains the error. */
    try<T>(onTry: () => T): Either<unknown, T>;
    /** Executes a function that may throw an error asynchronously, catching the error and returning a promise of an `Either` where the left side contains the error. */
    tryAsync<T, E>(onTry: () => T, onCatch: (e: unknown) => E): Promise<Either<Awaited<E>, Awaited<T>>>;
    /** Executes a function that may throw an error asynchronously, catching the error and returning a promise of an `Either` where the left side contains the error. */
    tryAsync<T>(onTry: () => T): Promise<Either<unknown, Awaited<T>>>;
    /** Throws an error if `fa` is a left, otherwise returns the right value. */
    throwLeft<B>(fa: Either<unknown, B>): B;
    /** Throws an error if `fa` is a right, otherwise returns the left value. */
    throwRight<A>(fa: Either<A, unknown>): A;
}

/** The `Either` monad having a fixed left type. Provides a set of functions for working with `Either` values. */
export interface IEither<L = any> extends IEitherCore, ISemigroup<$<KEither, L>>, IMonad<$<KEither, L>>, ITransformer<KEitherTrans<L>> { }

/** The either module with no fixed left type. */
const core: IEitherCore = {
    of: () => eitherOf(),
    right: (b) => ({ right: true, value: b }),
    left: (a) => ({ right: false, value: a }),
    either: (onLeft, onRight) => (fa) => fa.right ? onRight(fa.value) : onLeft(fa.value),
    bimap: (onLeft, onRight) => (fa) => fa.right ? core.right(onRight(fa.value)) : core.left(onLeft(fa.value)),
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
    or: b => fa => fa.right ? fa : b,
    and: b => fa => fa.right ? b : fa,
    else: b => fa => fa.right ? fa.value : b(),
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

/** Creates an `IEither` with a fixed left type. */
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
            append: (fa, fb) => fa.right ? fa : fb,
            transform: <M>(outer: IMonad<M>) => {
                type KType = $<KEitherTrans<L>, M>;

                return monadTrans<KEitherTrans<L>, M>({
                    map: (fa, f) => outer.map(fa, a => base.map(a, f)),
                    unit: <A>(a: A) => outer.unit<Either<L, A>>(base.right(a)),
                    bind: <A, B>(fa: $<KType, A>, f: (a: A) => $<KType, B>): $<KType, B> =>
                        outer.bind(fa, a => a.right ? f(a.value) : outer.unit<Either<L, B>>(a)),
                    lift: <A>(a: $<M, A>) => outer.map<A, Either<L, A>>(a, base.right),
                    wrap: a => outer.unit(a),
                });
            },
            ...base
        })
    )
}

/** The `either` module, providing a set of functions for working with `Either` values. The left type is fixed to `any`. To change the left type, call the `of` function. */
export const either = eitherOf<any>();
