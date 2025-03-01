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

export type Nothing = Left<void>
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
    either<A, B, C = B>(onLeft: () => B, onRight: (b: A) => C): (fa: Maybe<A>) => B | C;
    filter<T, S extends T>(predicate: (item: T) => item is S): (items: Maybe<T>) => Maybe<S>;
    filter<T>(predicate: (item: T) => unknown): (items: Maybe<T>) => Maybe<T>;
    fromList<A>(fa: A[]): Maybe<A>
    toList<A>(fa: Maybe<A>): [] | [A]
    fromNullable<A>(a: A): Maybe<NonNullable<A>>
    if(cond: unknown): Maybe<null>
    or<B>(b: B): <A>(fa: Maybe<A>) => Maybe<A> | B
    and<B>(b: B): <A>(fa: Maybe<A>) => Maybe<A> | B
    else<B>(b: Lazy<B>): <A>(fa: Maybe<A>) => A | B
    transform<M>(base: IMonad<M>): IMaybeTrans<M>
    liftMonoid<M>(base: IMonad<M>): IMaybeTrans<M>
}

export interface IMaybeTrans<M> extends IMonadTrans<$<$Q, KMaybe>, M>, IFold<$B2<M, KMaybe>, M>, IMonadPlus<$B2<M, KMaybe>> {
    either<A, B, C = B>(onLeft: () => $<M, B>, onRight: (b: A) => $<M, C>): (fa: $<M, Maybe<A>>) => $<M, B | C>;
    fromList<A>(fa: $<M, A[]>): $<M, Maybe<A>>
    toList<A>(fa: $<M, Maybe<A>>): $<M, [] | [A]>
    fromNullable<A>(a: $<M, A>): $<M, Maybe<NonNullable<A>>>
    if(cond: $<M, unknown>): $<M, Maybe<null>>
    or<B>(b: $<M, B>): <A>(fa: $<M, Maybe<A>>) => $<M, Maybe<A> | B>
    and<B>(b: $<M, B>): <A>(fa: $<M, Maybe<A>>) => $<M, Maybe<A> | B>
    else<B>(b: Lazy<$<M, B>>): <A>(fa: $<M, Maybe<A>>) => $<M, A | B>
}

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
