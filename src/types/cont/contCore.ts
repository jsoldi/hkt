import { $, KRoot } from "../../core/hkt.js";
import { IMonad, monad } from "../../classes/monad.js";
import { Maybe, maybe } from "../maybe.js";
import { pipe } from "../../core/utils.js";
import { IContMonad } from "./contMonad.js";

/** The continuation monad. The result of computations are wrapped in type `M`. */
export type Cont<T, M> = <R>(resolve: (t: T) => $<M, R>) => $<M, R>;

/** The higher-kinded type of the continuation monad. The result of computations are wrapped in type `M`. */
export interface KCont<M> extends KRoot {
    readonly 0: unknown
    readonly body: Cont<this[0], M>
}

/** The continuation monad interface. */
export interface ICont<M> extends IMonad<KCont<M>> {
    /** Changes the result type of the continuation monad. */
    mapCont<M, N, I = N>(wrap: <R>(r: $<N, R>) => $<M, $<I, R>>, peel: <R>(mb: $<M, $<I, R>>) => $<N, R>): <A>(ca: Cont<A, M>) => Cont<A, N>
    /** Memoizes the result of a continuation. The given function must be pure and its argument must be serializable. */
    memo<A, B>(f: (a: A) => Cont<B, M>): (a: A) => Cont<B, M>
    /** Repeatedly maps the continuation through the given function until the predicate is satisfied. */
    until<A, B>(predicate: (a: A) => Maybe<B>): (fa: Cont<A, M>) => Cont<B, M>
    /** Repeatedly evaluates a continuation while the predicate is satisfied. */
    doWhile<A>(predicate: (a: A) => boolean): (fa: Cont<A, M>) => Cont<A, M>
}

/** Creates a continuation monad where results are wrapped in type `M`. */
export function contCore<M>(): ICont<M> {
    type I = IContMonad<M>;

    return pipe(
        monad<KCont<M>>({
            unit: a => resolve => resolve(a),
            bind: (fa, f) => resolve => fa(a => f(a)(resolve)),
            map: (fa, f) => resolve => fa(a => resolve(f(a))),
        }),
        base => {
            const mapCont: I['mapCont'] = (wrap, peel) => ca => resolve => 
                peel(ca(a => wrap(resolve(a))));

            const until: I['until'] = predicate => fa => resolve => fa(a => {
                const mb = predicate(a);

                if (mb.right) {
                    return resolve(mb.value);
                } else {
                    return until(predicate)(fa)(resolve); 
                }
            });

            const doWhile: I['doWhile'] = predicate => until(a => predicate(a) ? maybe.nothing : maybe.just(a));
            
            const _memo = <A, B>(f: (a: A) => Cont<B, M>): ((a: A) => Cont<B, M>) => {
                const cache = new Map<A, [B]>();

                return (a: A) => {
                    const bs = cache.get(a);

                    if (bs !== undefined) {
                        return resolve => resolve(bs[0]);
                    } else {
                        return resolve => f(a)(b => {
                            cache.set(a, [b]);
                            return resolve(b);
                        });
                    }
                }
            };

            return {
                ...base,
                mapCont,
                until,
                doWhile,
                memo: _memo,
            }
        }
    )
}
