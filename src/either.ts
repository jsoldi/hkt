import { HKT, Kind } from "./hkt.js"
import { Monad, monad } from "./monad.js"

export interface Left<L> {
    left: true
    value: L
}

export interface Right<R> {
    left: false
    value: R
}

export type Either<L, R> = Left<L> | Right<R>

export namespace Either {
    export const left = <A>(a: A): Left<A> => ({ left: true, value: a });
    export const right = <B>(b: B): Right<B> => ({ left: false, value: b });
    export const either = <A>(left: boolean, value: A): Either<A, A> => ({ left, value });
    export const swap = <A, B>(fa: Either<A, B>): Either<B, A> => ({ left: !fa.left, value: fa.value }) as Either<B, A>;
    export const match = <A, B, C, D>(onLeft: (a: A) => C, onRight: (b: B) => D) => (fa: Either<A, B>) => fa.left ? onLeft(fa.value) : onRight(fa.value);
}
