import { $, $B2, $Q, KRoot } from "../core/hkt.js";
import { IMonad } from "../classes/monad.js";
import { IMonadPlus, monadPlus } from "../classes/monadPlus.js";
import { IMonadTrans, ITransformer, monadTrans } from "../classes/transformer.js";
import { ITraversable, traversable } from "../classes/traversable.js";
import { IFold } from "../classes/fold.js";
import { foldable, IFoldable } from "../classes/foldable.js";
import { Left, Right, either } from "./either.js";
import { monoid } from "../classes/monoid.js";
import { Lazy } from "./lazy.js";

/** Represents the lack of a value. */
export type Nothing = Left<void>
/** Represents an existing value. */
export type Just<T> = Right<T>
/** Represents a value that may or may not exist. */
export type Maybe<T> = Just<T> | Nothing

/** The higher-kinded type of `Maybe`. */
export interface KMaybe extends KRoot {
    readonly 0: unknown
    readonly body: Maybe<this[0]>
}

/** The maybe interface, providing a set of functions for working with `Maybe` values. */
export interface IMaybe extends IMonadPlus<KMaybe>, IFoldable<KMaybe>, ITraversable<KMaybe>, ITransformer<$<$Q, KMaybe>> {
    /** Creates a `Just` value, representing an existing value. */
    just<A>(a: A): Just<A>
    /** The `Nothing` value, representing the lack of a value. */
    readonly nothing: Nothing
    /** Checks if the given value is a `Just`. */
    isJust<A>(fa: Maybe<A>): fa is Just<A>
    /** Checks if the given value is a `Nothing`. */
    isNothing<A>(fa: Maybe<A>): fa is Nothing
    /** Applies one of two functions to the value of a `Maybe`. */
    either<A, B, C = B>(onLeft: () => B, onRight: (b: A) => C): (fa: Maybe<A>) => B | C;
    /** Filters a `Maybe` value based on a predicate. */
    filter<T, S extends T>(predicate: (item: T) => item is S): (items: Maybe<T>) => Maybe<S>;
    /** Filters a `Maybe` value based on a predicate. */
    filter<T>(predicate: (item: T) => unknown): (items: Maybe<T>) => Maybe<T>;
    /** Returns the first value in a list, or `Nothing` if the list is empty. */
    fromList<A>(fa: A[]): Maybe<A>
    /** Converts a `Maybe` to an empty or single-element list. */
    toList<A>(fa: Maybe<A>): [] | [A]
    /** Converts `null` or `undefined` to `Nothing` or wraps the value in a `Just`. */
    fromNullable<A>(a: A): Maybe<NonNullable<A>>
    /** Returns `Nothing` if the condition is false, otherwise returns just null. */
    if(cond: unknown): Maybe<null>
    /** Returns `fa` if it has a value, otherwise returns `b`. */
    or<B>(b: B): <A>(fa: Maybe<A>) => Maybe<A> | B
    /** Returns `b` if `fa` has a value, otherwise returns `fa`. */
    and<B>(b: B): <A>(fa: Maybe<A>) => Maybe<A> | B
    /** Returns the value of `fa` if it has a value, otherwise returns the value of `b`. */
    else<B>(b: Lazy<B>): <A>(fa: Maybe<A>) => A | B
    /** Produces a monad transformer having `Maybe` as the inner monad. */
    transform<M>(base: IMonad<M>): IMaybeTrans<M>
    /** Lifts the maybe monoid into a monad. */
    liftMonoid<M>(base: IMonad<M>): IMaybeTrans<M>
}

/** The maybe transformer interface, providing a set of functions for working with `Maybe` values within a monad. */
export interface IMaybeTrans<M> extends IMonadTrans<$<$Q, KMaybe>, M>, IFold<$B2<M, KMaybe>, M>, IMonadPlus<$B2<M, KMaybe>> {
    /** Applies one of two functions to the value of a `Maybe` within a monad. */
    either<A, B, C = B>(onLeft: () => $<M, B>, onRight: (b: A) => $<M, C>): (fa: $<M, Maybe<A>>) => $<M, B | C>;
    /** Returns the first value in a list, or `Nothing` if the list is empty. */
    fromList<A>(fa: $<M, A[]>): $<M, Maybe<A>>
    /** Converts a `Maybe` to an empty or single-element list. */
    toList<A>(fa: $<M, Maybe<A>>): $<M, [] | [A]>
    /** Converts `null` or `undefined` to `Nothing` or wraps the value in a `Just`. */
    fromNullable<A>(a: $<M, A>): $<M, Maybe<NonNullable<A>>>
    /** Returns `Nothing` if the condition is false, otherwise returns just null. */
    if(cond: $<M, unknown>): $<M, Maybe<null>>
    /** Returns `fa` if it has a value, otherwise returns `b`. */
    or<B>(b: $<M, B>): <A>(fa: $<M, Maybe<A>>) => $<M, Maybe<A> | B>
    /** Returns `b` if `fa` has a value, otherwise returns `fa`. */
    and<B>(b: $<M, B>): <A>(fa: $<M, Maybe<A>>) => $<M, Maybe<A> | B>
    /** Returns the value of `fa` if it has a value, otherwise returns the value of `b`. */
    else<B>(b: Lazy<$<M, B>>): <A>(fa: $<M, Maybe<A>>) => $<M, A | B>
}

/** The maybe module, providing a set of functions for working with `Maybe` values. */
export const maybe: IMaybe = (() => {
    const base = either.of<void>();
    const just = <A>(a: A): Just<A> => base.right(a);
    const nothing: Nothing = base.left(undefined);
    const isJust = <A>(fa: Maybe<A>): fa is Just<A> => fa.right;
    const isNothing = <A>(fa: Maybe<A>): fa is Nothing => !fa.right;
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

    const transform = <M>(m: IMonad<M>): IMaybeTrans<M> => {
        const et = base.transform(m);

        const __monadTrans = monadTrans<$<$Q, KMaybe>, M>({ 
            map: et.map,
            unit: et.unit,
            bind: et.bind,
            lift: et.lift,
            wrap: et.wrap
        });

        const __monoid = monoid<$B2<M, KMaybe>>({
            empty: <A>() => m.unit(empty<A>()),
            append: <A>(fa: $<M, Maybe<A>>, fb: $<M, Maybe<A>>) => m.bind(
                fa, 
                ma => ma.right ? m.unit<Maybe<A>>(ma) : fb
            )
        });

        const __foldable: IFold<$B2<M, KMaybe>, M> = _foldable.liftFoldUnder<M>(m);
    
        return {
            ...__monadTrans,
            ...__foldable,
            ...monadPlus<$B2<M, KMaybe>>({
                append: __monoid.append,
                bind: __monadTrans.bind,
                empty: __monoid.empty,
                unit: __monadTrans.unit,
            }),
            or: <B>(b: $<M, B>) => <A>(fa: $<M, Maybe<A>>): $<M, Maybe<A> | B> => m.bind(fa, ma => 
                (ma.right ? m.unit(ma) : b) as $<M, Maybe<A> | B>
            ),
            and: <B>(b: $<M, B>) => <A>(fa: $<M, Maybe<A>>): $<M, Maybe<A> | B> => m.bind(fa, ma =>
                (ma.right ? b : m.unit(ma)) as $<M, Maybe<A> | B>
            ),
            else: <B>(b: Lazy<$<M, B>>) => <A>(fa: $<M, Maybe<A>>): $<M, A | B> => m.bind(fa, ma =>
                (ma.right ? m.unit(ma.value) : b()) as $<M, A | B>
            ),
            either: <A, B, C = B>(onLeft: () => $<M, B>, onRight: (b: A) => $<M, C>) => (fa: $<M, Maybe<A>>) => m.bind(fa, ma =>
                (ma.right ? onRight(ma.value) : onLeft()) as $<M, B | C>
            ),
            fromList: <A>(fa: $<M, A[]>) => m.map(fa, fromList),
            toList: <A>(fa: $<M, Maybe<A>>) => m.map(fa, toList),
            fromNullable: <A>(a: $<M, A>) => m.map(a, fromNullable),
            if: (cond: $<M, unknown>) => m.map(cond, _if)
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
        fromList,
        toList,  
        fromNullable,
        or: base.or,
        and: base.and,
        else: base.else,
        either: base.either,
        transform,
        liftMonoid: transform, // Override default to make it short-circuit on append
    };
})();
