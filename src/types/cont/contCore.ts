import { $, KRoot } from "../../core/hkt.js";
import { IMonad, monad } from "../../classes/monad.js";
import { Maybe, maybe } from "../maybe.js";
import { pipe } from "../../core/utils.js";
import { IContMonad } from "./contMonad.js";

export type Cont<T, M> = <R>(resolve: (t: T) => $<M, R>) => $<M, R>;

export interface KCont<M> extends KRoot {
    readonly 0: unknown
    readonly body: Cont<this[0], M>
}

export interface ICont<M> extends IMonad<KCont<M>> {
    mapCont<M, N, I = N>(wrap: <R>(r: $<N, R>) => $<M, $<I, R>>, peel: <R>(mb: $<M, $<I, R>>) => $<N, R>): <A>(ca: Cont<A, M>) => Cont<A, N>
    memo<A, B>(f: (a: A) => Cont<B, M>): (a: A) => Cont<B, M>
    until<A, B>(predicate: (a: A) => Maybe<B>): (fa: Cont<A, M>) => Cont<B, M>
    doWhile<A>(predicate: (a: A) => boolean): (fa: Cont<A, M>) => Cont<A, M>
}

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
                    return until(predicate)(fa)(resolve); // Here you could return a thunk
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
