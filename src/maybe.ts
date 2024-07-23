import { Left, Right, either } from "./either.js";
import { KRoot } from "./hkt.js";
import { IMonad } from "./monad.js";
import { IMonadPlus, monadPlus } from "./monadPlus.js";
import { ITransformer } from "./transformer.js";

export const unit = Symbol("unit");
export type Unit = typeof unit;
export type Nothing = Left<Unit>
export type Just<T> = Right<T>
export type Maybe<T> = Just<T> | Nothing

export interface KMaybe extends KRoot {
    readonly 0: unknown
    readonly body: Maybe<this[0]>
}

export interface IMaybe extends IMonadPlus<KMaybe>, ITransformer<KMaybe> {
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
    const nothing: Nothing = either.left(unit);
    const isJust = <A>(fa: Maybe<A>): fa is Just<A> => fa.right;
    const isNothing = <A>(fa: Maybe<A>): fa is Nothing => !fa.right;
    const maybe = <B, A, C>(b: B, map?: (a: A) => C) => (fa: Maybe<A>) => fa.right ? map?.(fa.value) ?? fa.value : b;
    const listToMaybe = <A>(fa: A[]): Maybe<A> => fa.length > 0 ? just(fa[0]) : nothing;
    const maybeToList = <A>(fa: Maybe<A>): [] | [A] => fa.right ? [fa.value] : [];

    const m = monadPlus<KMaybe>({
        unit: just,
        bind: <A, B>(fa: Maybe<A>, f: (a: A) => Maybe<B>): Maybe<B> => fa.right ? f(fa.value) : nothing,
        empty: () => nothing,
        concat: (fa, fb) => fa.right && fb.right ? just(fb.value) : nothing
    });
    
    const transform = <F>(outer: IMonad<F>) => 
        either.monad<Unit>().transform(outer); // Not sure why this works
    
    return { 
        ...m, 
        just, 
        nothing,
        isJust,
        isNothing,
        maybe,
        listToMaybe,
        maybeToList,  
        transform  
    };
})();
