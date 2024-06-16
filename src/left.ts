import { Either } from "./either.js";
import { HKT, Kind } from "./hkt.js";
import { Monad, monad } from "./monad.js";

export interface LeftHKT<R> extends HKT {
    readonly type: Either<this["_A"], R>
}

export interface LeftTransformHKT<R, F extends HKT> extends HKT {
    type: Kind<F, Either<this["_A"], R>>
}

export interface ILeft<R> extends Monad<LeftHKT<R>> {
    readonly failure: (b: R) => Either<unknown, R>
    readonly tryCatch: <A>(onTry: () => A, onCatch: (e: unknown) => R) => Either<A, R>
    readonly orElse: <C>(f: (a: R) => C) => <A>(fa: Either<A, R>) => A | C
    readonly or: <A>(f: (b: R) => Either<A, R>) => <B>(fa: Either<B, R>) => Either<A | B, R>
    readonly elseThrow: <A>(fa: Either<A, R>) => A
    readonly transform: <F extends HKT>(outer: Monad<F>) => Monad<LeftTransformHKT<R, F>>
}

export function left<R>(): ILeft<R> {
    const failure = (b: R) => Either.right(b);
    const orElse = <C>(f: (a: R) => C) => <A>(fa: Either<A, R>): A | C => !fa.left ? f(fa.value) : fa.value;
    const or = <A>(f: (b: R) => Either<A, R>) => <B>(fa: Either<B, R>): Either<A | B, R> => orElse(f)(Either.left(fa))
    const elseThrow = <A>(fa: Either<A, R>): A => orElse(e => { throw e })(fa)

    const tryCatch = <A>(onTry: () => A, onCatch: (e: unknown) => R) => {
        try {
            return Either.left(onTry());
        } catch (e) {
            return failure(onCatch(e));
        }
    }

    const leftMonad = monad<LeftHKT<R>>({
        unit: Either.left,
        bind: (fa, f) => fa.left ? f(fa.value) : fa
    });

    const transform = <F extends HKT>(outer: Monad<F>) => {
        return monad<LeftTransformHKT<R, F>>({
            unit: <A>(a: A): Kind<F, Either<A, R>> => outer.unit(Either.left(a)),
            bind: <A, B>(fa: Kind<F, Either<A, R>>, f: (a: A) => Kind<F, Either<B, R>>): Kind<F, Either<B, R>> =>
                outer.bind(fa, ae => ae.left ? f(ae.value) : outer.unit(ae))
        });
    }

    return { failure, orElse, or, elseThrow, tryCatch, ...leftMonad, transform };
}
