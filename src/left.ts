import { array } from "./array.js";
import { Either, either } from "./either.js";
import { KApp, KRoot } from "./hkt.js";
import { IMonad, monad } from "./monad.js";
import { ITransform, ITransMonad, KTransform } from "./transform.js";

export interface KLeft<R> extends KRoot {
    readonly 0: unknown
    readonly body: Either<this[0], R>
}

export interface ILeft<R = unknown> extends ITransMonad<KLeft<R>, KTransform<KLeft<R>>> {
    alt: <A>(r: R) => Either<A, R>
    orElse: <C>(f: (a: R) => C) => <A>(fa: Either<A, R>) => A | C
    or: <A>(f: (b: R) => Either<A, R>) => <B>(fa: Either<B, R>) => Either<A | B, R>
    elseThrow: <A>(fa: Either<A, R>) => A
    tryCatch: <A>(onTry: () => A, onCatch: (e: unknown) => R) => Either<A, R>
}

export function left<R = unknown>(): ILeft<R> {
    const alt = <A>(r: R): Either<A, R> => either.right(r);
    const orElse = <C>(f: (a: R) => C) => <A>(fa: Either<A, R>): A | C => !fa.left ? f(fa.value) : fa.value;
    const or = <A>(f: (b: R) => Either<A, R>) => <B>(fa: Either<B, R>): Either<A | B, R> => orElse(f)(either.left(fa))
    const elseThrow = <A>(fa: Either<A, R>): A => orElse(e => { throw e })(fa)

    const tryCatch = <A>(onTry: () => A, onCatch: (e: unknown) => R) => {
        try {
            return either.left(onTry());
        } catch (e) {
            return either.right(onCatch(e));
        }
    }

    const transform = <F>(outer: IMonad<F>): ITransform<F, KTransform<KLeft<R>>> => {
        const lift = <A>(a: KApp<F, A>): KApp<F, Either<A, R>> => outer.map(a, either.left<A, R>);

        const m = monad<KApp<KTransform<KLeft<R>>, F>>({
            unit: <A>(a: A): KApp<F, Either<A, R>> => outer.unit(either.left<A, R>(a)),
            bind: <A, B>(fa: KApp<F, Either<A, R>>, f: (a: A) => KApp<F, Either<B, R>>): KApp<F, Either<B, R>> =>
                outer.bind(fa, either.match(f, r => outer.unit(either.right(r))))
        });

        return { ...m, lift };
    };

    const m = monad<KLeft<R>>({
        unit: either.left,
        bind: (fa, f) => fa.left ? f(fa.value) : fa
    });

    return { alt, orElse, or, elseThrow, tryCatch, transform, ...m };
}
