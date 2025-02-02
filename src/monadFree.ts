import { either, Left, Right } from "./either.js";
import { IFunctor } from "./functor.js";
import { $, $K1, KRoot } from "./hkt.js";
import { IMonad, monad } from "./monad.js";

export type MonadFree<F, A> = Left<A> | Right<$<F, MonadFree<F, A>>>

export interface KMonadFree<F> extends KRoot {
    readonly 0: unknown
    readonly body: MonadFree<F, this[0]>
}

interface IMonadFree<F> extends IMonad<KMonadFree<F>> {
    readonly base: IFunctor<F>
    wrap<A>(fa: $<F, A>): MonadFree<F, A>
    foldFree<M>(monad: IMonad<M>): (interpreter: <B>(fa: $<F, B>) => $<M, B>) => <A>(free: MonadFree<F, A>) => $<M, A>
}

export function monadFree<F>(base: IFunctor<F>): IMonadFree<F> {
    const map = <A, B>(x: MonadFree<F, A>, f: (a: A) => B): MonadFree<F, B> => {
        if (x.right) {
            return either.right(base.map(x.value, kfa => map(kfa, f)));
        } else {
            return either.left(f(x.value));
        }
    }

    const unit = <A>(a: A): MonadFree<F, A> => either.left(a);

    const bind = <A, B>(m: MonadFree<F, A>, k: (a: A) => MonadFree<F, B>): MonadFree<F, B> => {
        if (m.right) {
            return either.right(base.map(m.value, x => bind(x, k)));
        } else {
            return k(m.value);
        }
    }

    const wrap = <A>(fa: $<F, A>): MonadFree<F, A> => either.right(base.map(fa, unit));

    const foldFree = <M>(monad: IMonad<M>) => (interpreter: <B>(fa: $<F, B>) => $<M, B>) => <A>(free: MonadFree<F, A>): $<M, A> => {
        if (free.right) {
            // If the free monad is a "suspended" computation in F (Right)
            const fa: $<F, MonadFree<F, A>> = free.value;
            // Interpret the functor layer using the interpreter
            const ma: $<M, MonadFree<F, A>> = interpreter(fa);
            // Flatten the result recursively
            return monad.bind(ma, m => foldFree(monad)(interpreter)(m));
        } else {
            // If the free monad is a "pure" value (Left)
            return monad.unit(free.value);
        }
    };

    // const fold = <A>(kfa: MonadFree<F, A>, monoid: IMonoid<F>): $<F, B> => {
    //     if (kfa.right) {
    //         const lel: $<F, MonadFree<F, A>> = kfa.value;

    //         const aver = base.map(lel, kfa => fold(kfa, b, f));

    //     } else {
    //         return monoid.append(kfa.value, monoid.empty());
    //     }
    // }

    return {
        ...monad<KMonadFree<F>>({
            unit,
            bind,
            map
        }),
        base,
        wrap,
        foldFree
    };
}
