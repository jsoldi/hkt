import { $, $B2, $Q, KRoot } from "../core/hkt.js";
import { IMonad } from "../classes/monad.js";
import { IMonadPlus, monadPlus } from "../classes/monadPlus.js";
import { IMonadTrans, ITransformer, monadTrans } from "../classes/transformer.js";
import { ITraversable, traversable } from "../classes/traversable.js";
import { IFold } from "../classes/fold.js";
import { foldable, IFoldable } from "../classes/foldable.js";
import { Left, Right, either } from "./either.js";
import { IMonoid, monoid } from "../classes/monoid.js";

export type Nothing = Left<never>
export type Just<T> = Right<T>
export type Maybe<T> = Just<T> | Nothing

export interface KMaybe extends KRoot {
    readonly 0: unknown
    readonly body: Maybe<this[0]>
}

export interface IMaybe extends IMonadPlus<KMaybe>, IFoldable<KMaybe>, ITraversable<KMaybe>, ITransformer<$<$Q, KMaybe>> {
    just<A>(a: A): Just<A>
    readonly nothing: Nothing
    isJust<A>(fa: Maybe<A>): fa is Just<A>
    isNothing<A>(fa: Maybe<A>): fa is Nothing
    maybe<B, A, C>(b: B, map: (a: A) => C): (fa: Maybe<A>) => C | B
    maybe<B>(b: B): <A>(fa: Maybe<A>) => A | B
    fromList<A>(fa: A[]): Maybe<A>
    toList<A>(fa: Maybe<A>): [] | [A]
    fromNullable<A>(a: A): Maybe<NonNullable<A>>
    if(cond: unknown): Maybe<null>
    transform<M>(base: IMonad<M>): IMaybeTrans<M>
}

export interface IMaybeTrans<M> extends IMonadTrans<$<$Q, KMaybe>, M>, IFold<$B2<M, KMaybe>, M>, IMonadPlus<$B2<M, KMaybe>> {
}

export const maybe: IMaybe = (() => {
    const base = either.of<never>();
    const just = <A>(a: A): Just<A> => base.right(a);

    const nothing: Nothing = ({ 
        right: false, 
        get value(): never { 
            throw new Error("Nothing has no value"); // TODO: Make sure nobody touches `value` when this is a nothing
        } 
    });

    const isJust = <A>(fa: Maybe<A>): fa is Just<A> => fa.right;
    const isNothing = <A>(fa: Maybe<A>): fa is Nothing => !fa.right;
    const maybe = <B, A, C>(b: B, map?: (a: A) => C) => (fa: Maybe<A>) => fa.right ? map?.(fa.value) ?? fa.value : b;
    const fromList = <A>(fa: A[]): Maybe<A> => fa.length > 0 ? just(fa[0]) : nothing;
    const toList = <A>(fa: Maybe<A>): [] | [A] => fa.right ? [fa.value] : [];
    const map = <A, B>(fa: Maybe<A>, f: (a: A) => B): Maybe<B> => fa.right ? just(f(fa.value)) : nothing;
    const unit = <A>(a: A): Maybe<A> => just(a);
    const bind = <A, B>(fa: Maybe<A>, f: (a: A) => Maybe<B>): Maybe<B> => fa.right ? f(fa.value) : nothing;
    const fromNullable = <A>(a: A): Maybe<NonNullable<A>> => a == null ? nothing : just<NonNullable<A>>(a);
    const empty = <A>(): Maybe<A> => nothing;
    const append = base.append;
    const _if = (cond: unknown) => cond ? just(null) : nothing;

    const _monadPlus = monadPlus<KMaybe>({
        map,
        unit,
        bind,
        empty,
        append
    });

    const _foldable = foldable<KMaybe>({
        map,
        foldl: f => b => fa => fa.right ? f(b, fa.value) : b
    });

    const transform = <M>(outer: IMonad<M>): IMaybeTrans<M> => {
        const et = base.transform(outer);

        const __monadTrans = monadTrans<$<$Q, KMaybe>, M>({ 
            map: et.map,
            unit: et.unit,
            bind: et.bind,
            lift: et.lift,
            wrap: et.wrap
        });

        // Not using `liftMonoid` to keep the short-circuiting behavior
        const __monoid: IMonoid<$B2<M, KMaybe>> = monoid<$B2<M, KMaybe>>({
            empty: () => outer.unit(empty()),
            //append: (fa, fb) => outer.lift2(append)(fa, fb)
            append: <A>(fa: $<M, Maybe<A>>, fb: $<M, Maybe<A>>) => outer.bind(fa, ma => ma.right ? outer.unit<Maybe<A>>(ma) : fb)
        });

        const __foldable: IFold<$B2<M, KMaybe>, M> = _foldable.liftFoldUnder<M>(outer);

        return {
            ...__monadTrans,
            ...__foldable,
            ...monadPlus<$B2<M, KMaybe>>({
                append: __monoid.append,
                bind: __monadTrans.bind,
                empty: __monoid.empty,
                unit: __monadTrans.unit,
            }),
        }
    };

    const _traversable = traversable<KMaybe>({
        traverse: m => f => fa => fa.right ? m.map(f(fa.value), unit) : m.unit(empty())
    });

    return { 
        ..._traversable,
        ..._foldable,
        ..._monadPlus, 
        if: _if,
        just, 
        nothing,
        isJust,
        isNothing,
        maybe,
        fromList,
        toList,  
        fromNullable,
        transform,
    };
})();
