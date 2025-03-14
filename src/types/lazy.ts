import { IMonad, monad } from "../classes/monad.js";
import { IMonadTrans, monadTrans } from "../classes/transformer.js";
import { $, $B, $Q, KRoot } from "../core/hkt.js"
import { id, memo, pipe } from "../core/utils.js";
import { Free } from "./free/free.js";

/** Alias for a constant function. */
export type Lazy<T> = () => T

/** Higher-kinded type for lazy values. */
export interface KLazy extends KRoot {
    readonly 0: unknown
    readonly body: Lazy<this[0]>
}

/** The lazy monad. */
export interface ILazy extends IMonad<KLazy> {
    /** Memoizes the given lazy value. */
    memo<A>(f: Lazy<A>): Lazy<A>
    /** Creates a lazy value from the given constant function. */
    lazy<A>(f: () => A): Lazy<A>
    /** Evaluates the given lazy value. */
    run<A>(fa: Lazy<A>): A
    /** Non-recursively evaluates the given free monad having as its underlying functor the lazy functor. */ 
    runFree<A>(t: Free<A, KLazy>): Lazy<A>
    /** Transforms the given monad into a monad transformer where the lazy is the outer monad. */
    transformOver<M>(m: IMonad<M>): IMonadTrans<KTransformOver, M>
    /** Transforms the given monad into a monad transformer where the lazy is the inner monad. */
    transformUnder<M>(m: IMonad<M>): IMonadTrans<KTransformUnder, M>
}

/** The lazy monad transformer type where the lazy is the outer monad. */
export type KTransformOver = $<$B, KLazy>;
/** The lazy monad transformer type where the lazy is the inner monad. */
export type KTransformUnder = $<$Q, KLazy>;

/** The lazy monad transformer where the lazy is the outer monad. */
export interface ITransformOver<M> extends IMonadTrans<KTransformOver, M> {
    drop<A>(ma: Lazy<$<M, A>>): $<M, A>
}

/** The lazy monad transformer where the lazy is the inner monad. */
export interface ITransformUnder<M> extends IMonadTrans<KTransformUnder, M> {
    drop<A>(ma: $<M, Lazy<A>>): $<M, A>
}

/** The lazy monad, providing a set of functions for working with lazy values. */
export const lazy: ILazy = (() => {
    return pipe(
        monad<KLazy>({
            unit: a => () => a,
            bind: (fa, f) => () => f(fa())(),
            map: (fa, f) => () => f(fa()),
        }),
        base => {
            const run = <A>(fa: Lazy<A>): A => fa();

            const runFree = <A>(t: Free<A, KLazy>): Lazy<A> => () => {
                while (t.right)
                    t = t.value();
                
                return t.value;
            }

            const transformOver = <M>(m: IMonad<M>): ITransformOver<M> => {
                const unit = <A>(a: A): Lazy<$<M, A>> => () => m.unit(a);
                const bind = <A, B>(fma: Lazy<$<M, A>>, f: (a: A) => Lazy<$<M, B>>): Lazy<$<M, B>> => () => m.bind(fma(), a => f(a)());
                const map = <A, B>(fa: Lazy<$<M, A>>, f: (a: A) => B): Lazy<$<M, B>> => () => m.map(fa(), f);
                const lift = <A>(ma: $<M, A>): Lazy<$<M, A>> => () => ma;
                const wrap = <A>(fa: Lazy<A>): Lazy<$<M, A>> => () => m.unit(fa());
        
                return {
                    ...monadTrans<KTransformOver, M>({ unit, bind, map, lift, wrap }),
                    drop: run,
                };
            }
        
            const transformUnder = <M>(m: IMonad<M>): ITransformUnder<M> => {
                const unit = <A>(a: A): $<M, Lazy<A>> => m.unit(() => a);
                const bind = <A, B>(ma: $<M, Lazy<A>>, f: (a: A) => $<M, Lazy<B>>): $<M, Lazy<B>> => m.bind(ma, a => f(a()));
                const map = <A, B>(ma: $<M, Lazy<A>>, f: (a: A) => B): $<M, Lazy<B>> => m.map(ma, a => () => f(a()));
                const lift = <A>(ma: $<M, A>): $<M, Lazy<A>> => m.map(ma, a => () => a);
                const wrap = <A>(fa: Lazy<A>): $<M, Lazy<A>> => m.unit(() => fa());
                const drop = <A>(ma: $<M, Lazy<A>>): $<M, A> => m.map(ma, a => a());
        
                return {
                    ...monadTrans<KTransformUnder, M>({ unit, bind, map, lift, wrap }),
                    drop,
                };
            }
        
            return {
                ...base,
                runFree,
                run,
                memo,
                lazy: id,
                transformOver,
                transformUnder,
            }
        }
    );
})();
