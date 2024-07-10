export interface Left<out L> {
    readonly left: true
    readonly value: L
}

export interface Right<out R> {
    readonly left: false
    readonly value: R
}

export type Either<L, R> = Left<L> | Right<R>

export interface IEither {
    left: <A, B = never>(a: A) => Either<A, B>
    right: <B, A = never>(b: B) => Either<A, B>
    either: <A>(left: boolean, value: A) => Either<A, A>
    swap: <A, B>(fa: Either<A, B>) => Either<B, A>
    match: <A, R, AR, RR = AR>(onLeft: (a: A) => AR, onRight: (b: R) => RR) => (fa: Either<A, R>) => AR | RR
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
