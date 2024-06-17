export interface Left<L> {
    left: true
    value: L
}

export interface Right<R> {
    left: false
    value: R
}

export type Either<L, R> = Left<L> | Right<R>

export interface IEither {
    left: <A>(a: A) => Left<A>
    right: <B>(b: B) => Right<B>
    either: <A>(left: boolean, value: A) => Either<A, A>
    swap: <A, B>(fa: Either<A, B>) => Either<B, A>
    match: <A, B, C, D>(onLeft: (a: A) => C, onRight: (b: B) => D) => (fa: Either<A, B>) => C | D
}

export const either: IEither = (() => {
    return {
        left: <A>(a: A): Left<A> => ({ left: true, value: a }),
        right: <B>(b: B): Right<B> => ({ left: false, value: b }),
        either: <A>(left: boolean, value: A): Either<A, A> => ({ left, value }),
        swap: <A, B>(fa: Either<A, B>): Either<B, A> => ({ left: !fa.left, value: fa.value }) as Either<B, A>,
        match: <A, B, C, D>(onLeft: (a: A) => C, onRight: (b: B) => D) => (fa: Either<A, B>) => fa.left ? onLeft(fa.value) : onRight(fa.value)
    }
})();
