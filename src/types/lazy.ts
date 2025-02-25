import { IMonad, monad } from "../classes/monad.js";
import { IMonadTrans, monadTrans } from "../classes/transformer.js";
import { $, $B, $Q, KRoot } from "../core/hkt.js"
import { id, memo, pipe } from "../core/utils.js";
import { Free } from "./free/free.js";

export type Lazy<T> = () => T

export interface KLazy extends KRoot {
    readonly 0: unknown
    readonly body: Lazy<this[0]>
}

interface ILazy extends IMonad<KLazy> {
    memo<A>(f: Lazy<A>): Lazy<A>
    lazy<A>(f: () => A): Lazy<A>
    run<A>(fa: Lazy<A>): A
    runFree<A>(t: Free<A, KLazy>): Lazy<A>
    transformOver<M>(m: IMonad<M>): IMonadTrans<KTransformOver, M>
    transformUnder<M>(m: IMonad<M>): IMonadTrans<KTransformUnder, M>
}

export type KTransformOver = $<$B, KLazy>;
export type KTransformUnder = $<$Q, KLazy>;

export interface ITransformOver<M> extends IMonadTrans<KTransformOver, M> {
    drop<A>(ma: Lazy<$<M, A>>): $<M, A>
}

export interface ITransformUnder<M> extends IMonadTrans<KTransformUnder, M> {
    drop<A>(ma: $<M, Lazy<A>>): $<M, A>
}

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
