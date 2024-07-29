import { Left, Right, either } from "./either.js";
import { $, $F, KRoot } from "./hkt.js";
import { IMonad } from "./monad.js";
import { IMonadPlus, monadPlus } from "./monadPlus.js";
import { ITransformer, monadTrans } from "./transformer.js";

export type Nothing = Left<null>
export type Just<T> = Right<T>
export type Maybe<T> = Just<T> | Nothing

export interface KMaybe extends KRoot {
    readonly 0: unknown
    readonly body: Maybe<this[0]>
}

export interface IMaybe extends IMonadPlus<KMaybe>, ITransformer<$<$F, KMaybe>> {
    just<A>(a: A): Just<A>
    readonly nothing: Nothing
    isJust<A>(fa: Maybe<A>): fa is Just<A>
    isNothing<A>(fa: Maybe<A>): fa is Nothing
    maybe<B, A, C>(b: B, map: (a: A) => C): (fa: Maybe<A>) => C | B
    maybe<B>(b: B): <A>(fa: Maybe<A>) => A | B
    fromList<A>(fa: A[]): Maybe<A>
    toList<A>(fa: Maybe<A>): [] | [A]
    fromNullable<A>(a: A): Maybe<NonNullable<A>>
}

export const maybe: IMaybe = (() => {
    const just = <A>(a: A): Just<A> => either.right(a);
    const nothing: Nothing = either.left(null);
    const isJust = <A>(fa: Maybe<A>): fa is Just<A> => fa.right;
    const isNothing = <A>(fa: Maybe<A>): fa is Nothing => !fa.right;
    const maybe = <B, A, C>(b: B, map?: (a: A) => C) => (fa: Maybe<A>) => fa.right ? map?.(fa.value) ?? fa.value : b;
    const fromList = <A>(fa: A[]): Maybe<A> => fa.length > 0 ? just(fa[0]) : nothing;
    const toList = <A>(fa: Maybe<A>): [] | [A] => fa.right ? [fa.value] : [];
    const map = <A, B>(fa: Maybe<A>, f: (a: A) => B): Maybe<B> => fa.right ? just(f(fa.value)) : nothing;
    const bind = <A, B>(fa: Maybe<A>, f: (a: A) => Maybe<B>): Maybe<B> => fa.right ? f(fa.value) : nothing;
    const fromNullable = <A>(a: A): Maybe<NonNullable<A>> => a == null ? nothing : just<NonNullable<A>>(a);

    const transform = <M>(outer: IMonad<M>) => {
        const et = either.monad<null>().transform(outer);
        
        return monadTrans<$<$F, KMaybe>, M>({ 
            map: et.map,
            unit: et.unit,
            bind: et.bind,
            lift: et.lift
        });
    };

    return { 
        ...monadPlus<KMaybe>({
            map,
            unit: just,
            bind,
            empty: () => nothing,
            append: (fa, fb) => fa.right && fb.right ? just(fb.value) : nothing
        }), 
        just, 
        nothing,
        isJust,
        isNothing,
        maybe,
        fromList,
        toList,  
        fromNullable,
        transform
    };
})();
