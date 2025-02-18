import { $I, $, KRoot, $3, $B2 } from "../../core/hkt.js";
import { IMonad, monad } from "../../classes/monad.js";
import { IMonadTrans, ITransformer, monadTrans } from "../../classes/transformer.js";
import { Maybe, maybe } from "../../types/maybe.js";
import { IThunkCore, thunk } from "../../types/thunk.js";
import { memo, pipe } from "../../core/utils.js";
import { contMonadOf, IContMonad } from "./contMonad.js";
import { contThunkOf, IContThunk } from "./contThunk.js";
import { contVoid, IContVoid } from "./contVoid.js";
import { KTask } from "../task.js";

export type Cont<T, M = $I> = <R>(resolve: (t: T) => $<M, R>) => $<M, R>;

export interface KCont<M> extends KRoot {
    readonly 0: unknown
    readonly body: Cont<this[0], M>
}

export interface KContTrans extends KRoot {
    readonly 0: unknown
    readonly body: $B2<this[0], KCont<this[0]>>
}

export type ContTrans<F, T> = $3<KContTrans, F, T>

export interface IContTrans<M> extends IMonadTrans<KContTrans, M> {
    drop<A>(mca: $<M, Cont<A, M>>): $<M, A>
    unwrap<A>(mca: $<M, Cont<A, M>>): Cont<A, M>
}

export interface IContCore<M> extends IMonad<KCont<M>>, ITransformer<KContTrans> {
    memo<A, B>(f: (a: A) => Cont<B, M>): (a: A) => Cont<B, M>
    until<A, B>(predicate: (a: A) => Maybe<B>): (fa: Cont<A, M>) => Cont<B, M>
    doWhile<A>(predicate: (a: A) => boolean): (fa: Cont<A, M>) => Cont<A, M>
    skip<A, B>(a: Cont<A, M>): (b: Cont<B, M>) => Cont<A, M>
    transform<T>(base: IMonad<T>): IContTrans<T>
}

export interface ICont<M> extends IContCore<M> {
    of<N>(): IContCore<N>
    ofMonad<N>(m: IMonad<N>): IContMonad<N>
    ofThunk<F>(t: IThunkCore<F>): IContThunk<F>
    readonly sync: IContThunk<$I>
    readonly async: IContThunk<KTask>
    readonly void: IContVoid
}

function contOf<M>(): IContCore<M> {
    type I = IContCore<M>;

    return pipe(
        monad<KCont<M>>({
            unit: a => resolve => resolve(a),
            bind: (fa, f) => resolve => fa(a => f(a)(resolve)),
            map: (fa, f) => resolve => fa(a => resolve(f(a))),
        }),
        base => {
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
                const cache = new Map<A, B>();

                return (a: A) => {
                    if (cache.has(a)) {
                        return resolve => resolve(cache.get(a)!);
                    } else {
                        return resolve => f(a)(b => {
                            cache.set(a, b);
                            return resolve(b);
                        });
                    }
                }
            };

            const skip: I['skip'] = a => b => base.bind(a, av => base.bind(b, _ => base.unit(av)));

            const transform = <M>(m: IMonad<M>): IContTrans<M> => {
                const base = contOf<M>();
                type I = IContTrans<M>;
                const drop: I['drop'] = mca => m.bind(mca, ca => ca(m.unit));
                const unwrap: I['unwrap'] = mca => resolve => m.bind(mca, ca => ca(resolve));
        
                return {
                    ...monadTrans<KContTrans, M>({
                        unit: a => m.unit(base.unit(a)),
                        bind: (mca, f) => m.bind(mca, ca => ca(f)),
                        lift: ma => m.map(ma, base.unit),
                        wrap: m.unit
                    }),
                    drop,
                    unwrap
                };
            }
            
            return {
                until,
                doWhile,
                skip,
                memo: _memo,
                transform,
                ...base
            }
        }
    )
}

export const cont: ICont<$I> = (() => {
    const base = contOf<$I>();
    const _sync = memo(() => contThunkOf(thunk.sync));
    const _async = memo(() => contThunkOf(thunk.async));
    const _void = memo(() => contVoid());    

    return {
        ...base,
        of: contOf,
        ofMonad: contMonadOf,
        ofThunk: contThunkOf,
        get sync() { return _sync() },
        get async() { return _async() },
        get void() { return _void() },
    }    
})();

export { IContMonad } from "./contMonad.js";
export { IContThunk, ContSync, ContAsync } from "./contThunk.js";
export { IContVoid, ContVoid } from "./contVoid.js";
