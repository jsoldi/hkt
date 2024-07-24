import { Left, Right, either } from "./either.js";
import { functor } from "./functor.js";
import { KApp, KRoot } from "./hkt.js";
import { IMonad, monad } from "./monad.js";
import { IMonadPlus, monadPlus } from "./monadPlus.js";
import { monoid } from "./monoid.js";
import { IMonadTrans, ITransformer, KTransIn } from "./transformer.js";

export type Nothing = Left<null>
export type Just<T> = Right<T>
export type Maybe<T> = Just<T> | Nothing

export interface KMaybe extends KRoot {
    readonly 0: unknown
    readonly body: Maybe<this[0]>
}

export interface IMaybe extends IMonadPlus<KMaybe>, ITransformer<KTransIn<KMaybe>> {
    just<A>(a: A): Just<A>
    readonly nothing: Nothing
    isJust<A>(fa: Maybe<A>): fa is Just<A>
    isNothing<A>(fa: Maybe<A>): fa is Nothing
    maybe<B, A, C>(b: B, map: (a: A) => C): (fa: Maybe<A>) => C | B
    maybe<B>(b: B): <A>(fa: Maybe<A>) => A | B
    listToMaybe<A>(fa: A[]): Maybe<A>
    maybeToList<A>(fa: Maybe<A>): [] | [A]
}

export const maybe: IMaybe = (() => {
    const just = <A>(a: A): Just<A> => either.right(a);
    const nothing: Nothing = either.left(null);
    const isJust = <A>(fa: Maybe<A>): fa is Just<A> => fa.right;
    const isNothing = <A>(fa: Maybe<A>): fa is Nothing => !fa.right;
    const maybe = <B, A, C>(b: B, map?: (a: A) => C) => (fa: Maybe<A>) => fa.right ? map?.(fa.value) ?? fa.value : b;
    const listToMaybe = <A>(fa: A[]): Maybe<A> => fa.length > 0 ? just(fa[0]) : nothing;
    const maybeToList = <A>(fa: Maybe<A>): [] | [A] => fa.right ? [fa.value] : [];
    const map = <A, B>(fa: Maybe<A>, f: (a: A) => B): Maybe<B> => fa.right ? just(f(fa.value)) : nothing;
    const bind = <A, B>(fa: Maybe<A>, f: (a: A) => Maybe<B>): Maybe<B> => fa.right ? f(fa.value) : nothing;

    const _monadPlus = monadPlus<KMaybe>({
        ...monad<KMaybe>({
            ...functor<KMaybe>({ map }),
            unit: just,
            bind,
        }),
        ...monoid<KMaybe>({
            empty: () => nothing,
            append: (fa, fb) => fa.right && fb.right ? just(fb.value) : nothing
        })
    });

    return { 
        ..._monadPlus, 
        just, 
        nothing,
        isJust,
        isNothing,
        maybe,
        listToMaybe,
        maybeToList,  
        transform: either.monad<null>().transform
    };
})();
