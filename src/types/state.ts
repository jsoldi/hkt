import { $, $I, KRoot } from "../core/hkt.js"
import { IMonad, monad } from "../classes/monad.js";
import { ITransformer, monadTrans } from "../classes/transformer.js";

/** The state monad transformer value type, representing a function that takes a state and returns a new state and a value wrapped in the given type `F`. */
export type StateTrans<F, S, T> = (a: S) => $<F, [T, S]>

/** The state monad value type. */
export type State<S, T> = StateTrans<$I, S, T>

/** Higher-kinded type of the state monad. */
export interface KState<S> extends KRoot {
    readonly 0: unknown
    readonly body: State<S, this[0]>
}

/** Higher-kinded type of the state monad transformer. */
export interface KStateTrans<S> extends KRoot {
    readonly 0: unknown
    readonly 1: unknown
    readonly body: StateTrans<this[0], S, this[1]>
}

/** The state interface, providing stateful computations. */
interface IState<S> extends IMonad<KState<S>>, ITransformer<KStateTrans<S>> {
    /** Produces a state that evaluates to the current state. */
    readonly get: State<S, S>
    /** Produces a state that evaluates to the given value. */
    put<S>(s: S): State<S, null>
    /** Creates a `state` module with a fixed environment type. */
    of<T>(): IState<T>
}

/** Creates a state monad with a fixed state type. */
function stateOf<S>(): IState<S> {
    const unit = <A>(a: A): State<S, A> => s => [a, s];

    const bind = <A, B>(fa: State<S, A>, f: (a: A) => State<S, B>): State<S, B> => s => {
        const [a, t] = fa(s);
        return f(a)(t);
    };

    const of = <T>() => stateOf<T>();
    const get: State<S, S> = s => [s, s];
    const put = <S>(s: S): State<S, null> => _ => [null, s];

    const transform = <M>(inner: IMonad<M>) => {
        const unit = <A>(a: A): StateTrans<M, S, A> => s => inner.unit([a, s] as const);

        const bind = <A, B>(fa: StateTrans<M, S, A>, f: (a: A) => StateTrans<M, S, B>): StateTrans<M, S, B> => s => 
            inner.bind(fa(s), ([a, t]) => f(a)(t));

        const lift = <A>(ma: $<M, A>): StateTrans<M, S, A> => s => inner.map(ma, a => [a, s] as const);

        const wrap: <A>(fa: State<S, A>) => StateTrans<M, S, A> = fa => s => inner.unit(fa(s));

        return monadTrans<KStateTrans<S>, M>({ unit, bind, lift, wrap });
    };

    return {
        ...monad<KState<S>>({ unit, bind }),
        of,
        get,
        put,
        transform
    }
}

/** The `state` module, providing a set of functions for working with state functions. The environment type is fixed to `any`. To change the environment type, call the `of` function. */
export const state = stateOf<any>();
