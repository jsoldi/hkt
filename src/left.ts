import { Either, either, Right, KEither } from "./either.js";
import { KApp2, KRoot } from "./hkt.js";
import { IMonad, monad } from "./monad.js";
import { ITransMonad } from "./transform.js";

export interface KLeftTransform<R> extends KRoot {
    readonly 0: unknown // F
    readonly 1: unknown // L
    readonly body: KApp2<this[0], Either<this[1], R>>
}

export interface ILeft<R = unknown> extends ITransMonad<KApp2<KEither, R>, KLeftTransform<R>> {
    failure: (a: R) => Right<R>
    orElse: <C>(f: (a: R) => C) => <A>(fa: Either<A, R>) => A | C
    or: <A>(f: (b: R) => Either<A, R>) => <B>(fa: Either<B, R>) => Either<A | B, R>
    elseThrow: <A>(fa: Either<A, R>) => A
    tryCatch: <A>(onTry: () => A, onCatch: (e: unknown) => R) => Either<A, R>
}

export function left<R = unknown>(): ILeft<R> {
    const failure = (b: R) => either.right(b);
    const orElse = <C>(f: (a: R) => C) => <A>(fa: Either<A, R>): A | C => !fa.left ? f(fa.value) : fa.value;
    const or = <A>(f: (b: R) => Either<A, R>) => <B>(fa: Either<B, R>): Either<A | B, R> => orElse(f)(either.left(fa))
    const elseThrow = <A>(fa: Either<A, R>): A => orElse(e => { throw e })(fa)

    const tryCatch = <A>(onTry: () => A, onCatch: (e: unknown) => R) => {
        try {
            return either.left(onTry());
        } catch (e) {
            return failure(onCatch(e));
        }
    }

    const transform = <F>(outer: IMonad<F>) => {
        const lift = <A>(a: KApp2<F, A>): KApp2<F, Either<A, R>> => {
            return outer.map(a, either.left);
        }

        const m = monad<KApp2<KLeftTransform<R>, F>>({
            unit: <A>(a: A): KApp2<F, Either<A, R>> => outer.unit(either.left(a)),
            bind: <A, B>(fa: KApp2<F, Either<A, R>>, f: (a: A) => KApp2<F, Either<B, R>>): KApp2<F, Either<B, R>> =>
                outer.bind(fa, ae => ae.left ? f(ae.value) : outer.unit(ae))
        });

        return { ...m, lift };
    };

    const m = monad<KApp2<KEither, R>>({
        unit: either.left,
        bind: (fa, f) => fa.left ? f(fa.value) : fa
    });

    return { failure, orElse, or, elseThrow, tryCatch, transform, ...m };
}
