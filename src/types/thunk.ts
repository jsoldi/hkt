import { KRoot, $, $I } from "../core/hkt.js";
import { memo } from "../core/utils.js";
import { IFunctor } from "../classes/functor.js";
import { IMonad, monad, trivial } from "../classes/monad.js";
import { Left, Right, either } from "./either.js";
import { KPromise, promise } from "./promise.js";

export type Thunk<T, F = $I> = Left<T> | Right<() => $<F, Thunk<T, F>>>;

export interface KThunk<F> extends KRoot {
    readonly 0: unknown
    readonly body: Thunk<this[0], F>
}

export interface IThunkBase<F> extends IFunctor<F> {
    run<A>(t: Thunk<A, F>): $<F, A>
}

export interface IThunkCore<F> extends IMonad<KThunk<F>> {
    readonly base: IFunctor<F>
    lazy<A>(f: () => $<F, Thunk<A, F>>): Thunk<A, F>
    delay<A>(f: () => $<F, A>): Thunk<A, F>
    run<A>(t: Thunk<A, F>): $<F, A>
}

export function thunkOf<F>(base: IThunkBase<F>): IThunkCore<F> {
    const unit = <A>(a: A): Thunk<A, F> => either.left(a);
    const lazy = <A>(f: () => $<F, Thunk<A, F>>): Thunk<A, F> => either.right(() => f());
    const delay = <A>(f: () => $<F, A>): Thunk<A, F> => lazy(() => base.map(f(), unit));

    const bind = <A, B>(fa: Thunk<A, F>, f: (a: A) => Thunk<B, F>): Thunk<B, F> => {
        if (fa.right) {
            return either.right(() => base.map(fa.value(), ta => bind(ta, f)));
        } else {
            return f(fa.value);
        }
    }

    return {
        ...monad<KThunk<F>>({ unit, bind }),
        base,
        run: base.run,
        lazy,
        delay,
    }
}

export interface IThunk extends IThunkCore<$I> {
    readonly async: IThunkCore<KPromise>
    of<F>(base: IThunkBase<F>): IThunkCore<F>
}

export const thunk = (() => {
    const of = <G>(base: IThunkBase<G>): IThunkCore<G> => thunkOf(base);

    const _sync = of({
        ...trivial,
        run: t => {
            while (t.right) 
                t = t.value();
    
            return t.value;
        }
    });
    
    const _async = memo(() => of({
        ...promise,
        run: async t => {
            while (t.right) 
                t = await t.value();
    
            return t.value;
        }
    }));

    return {
        ..._sync,
        sync: _sync,
        get async() { return _async() },
        of,
    }
})();
