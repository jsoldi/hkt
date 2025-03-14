import { functor, IFunctor } from "./functor.js";
import { $, $I } from "../core/hkt.js";
import { ITransformer, monadTrans } from "./transformer.js";
import { TypeClassArg } from "./utilities.js";
import { id } from "../core/utils.js";
import { pipe as _pipe } from "../core/utils.js";
import { Free } from "../types/free/functorFree.js";

/** The minimal definition of a monad. */
export interface IMonadBase<F> {
    /** Wraps a value in a monad. */
    unit<A>(a: A): $<F, A>
    /** Compose two actions, passing any value produced by the first as an argument to the second. */
    bind<A, B>(fa: $<F, A>, f: (a: A) => $<F, B>): $<F, B>
}

/** The monad interface. */
export interface IMonad<F> extends IMonadBase<F>, IFunctor<F> {
    /** Lifts a binary function to operate on monads. */
    lift2<A, B, C>(f: (a: A, b: B) => C): (fa: $<F, A>, fb: $<F, B>) => $<F, C>
    /** Lifts a ternary function to operate on monads. */
    lift3<A, B, C, D>(f: (a: A, b: B, c: C) => D): (fa: $<F, A>, fb: $<F, B>, fc: $<F, C>) => $<F, D>
    /** Maps a function over a monad and flattens the result. */
    flatMap<A, B>(f: (a: A) => $<F, B>): (fa: $<F, A>) => $<F, B>
    /** Runs a free monad using stack-unsafe recursion. Should be overridden by a stack-safe implementation when possible. */
    runFree<A>(t: Free<A, F>): $<F, A>
    /** Flattens a nested monad. */
    flat<A>(ffa: $<F, $<F, A>>): $<F, A>
    /** Composes multiple monadic functions. */
    fish<A>(): (...a: [A]) => $<F, A>
    /** Composes multiple monadic functions. */
    fish<A, B>(f: (...a: [A]) => $<F, B>): (...a: [A]) => $<F, B>
    /** Composes multiple monadic functions. */
    fish<A, B, C>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>): (a: A) => $<F, C>
    /** Composes multiple monadic functions. */
    fish<A, B, C, D>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>): (a: A) => $<F, D>
    /** Composes multiple monadic functions. */
    fish<A, B, C, D, E>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>): (a: A) => $<F, E>
    /** Composes multiple monadic functions. */
    fish<A, B, C, D, E, G>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>): (a: A) => $<F, G>
    /** Composes multiple monadic functions. */
    fish<A, B, C, D, E, G, H>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>): (a: A) => $<F, H>
    /** Composes multiple monadic functions. */
    fish<A, B, C, D, E, G, H, I>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>): (a: A) => $<F, I>
    /** Composes multiple monadic functions. */
    fish<A, B, C, D, E, G, H, I, J>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => $<F, J>): (a: A) => $<F, J>
    /** Composes multiple monadic functions. */
    fish<A, B, C, D, E, G, H, I, J, K>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => $<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => $<F, K>): (a: A) => $<F, K>
    /** Composes multiple monadic functions. */
    fish<A, B, C, D, E, G, H, I, J, K, L>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => $<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => $<F, K>, o: (...j: [K, J, I, H, G, E, D, C, B, A]) => $<F, L>): (a: A) => $<F, L>
    /** Composes multiple monadic functions. */
    fish<A, B, C, D, E, G, H, I, J, K, L, M>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => $<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => $<F, K>, o: (...j: [K, J, I, H, G, E, D, C, B, A]) => $<F, L>, p: (...k: [L, K, J, I, H, G, E, D, C, B, A]) => $<F, M>): (a: A) => $<F, M>
    /** Composes multiple monadic functions. */
    fish(...b: ((...a: any[]) => $<F, any>)[]): (...s: any[]) => $<F, any>
    /** Pipes a value through multiple monadic functions. */
    pipe<A>(a: $<F, A>): $<F, A>
    /** Pipes a value through multiple monadic functions. */
    pipe<A, B>(a: $<F, A>, b: (...a: [A]) => $<F, B>): $<F, B>
    /** Pipes a value through multiple monadic functions. */
    pipe<A, B, C>(a: $<F, A>, b: (...a: [A]) => $<F, B>, c: (...a: [B, A]) => $<F, C>): $<F, C>
    /** Pipes a value through multiple monadic functions. */
    pipe<A, B, C, D>(a: $<F, A>, b: (...a: [A]) => $<F, B>, c: (...a: [B, A]) => $<F, C>, d: (...a: [C, B, A]) => $<F, D>): $<F, D>
    /** Pipes a value through multiple monadic functions. */
    pipe<A, B, C, D, E>(a: $<F, A>, b: (...a: [A]) => $<F, B>, c: (...a: [B, A]) => $<F, C>, d: (...a: [C, B, A]) => $<F, D>, e: (...a: [D, C, B, A]) => $<F, E>): $<F, E>
    /** Pipes a value through multiple monadic functions. */
    pipe<A, B, C, D, E, G>(a: $<F, A>, b: (...a: [A]) => $<F, B>, c: (...a: [B, A]) => $<F, C>, d: (...a: [C, B, A]) => $<F, D>, e: (...a: [D, C, B, A]) => $<F, E>, f: (...a: [E, D, C, B, A]) => $<F, G>): $<F, G>
    /** Pipes a value through multiple monadic functions. */
    pipe<A, B, C, D, E, G, H>(a: $<F, A>, b: (...a: [A]) => $<F, B>, c: (...a: [B, A]) => $<F, C>, d: (...a: [C, B, A]) => $<F, D>, e: (...a: [D, C, B, A]) => $<F, E>, f: (...a: [E, D, C, B, A]) => $<F, G>, g: (...a: [G, E, D, C, B, A]) => $<F, H>): $<F, H>
    /** Pipes a value through multiple monadic functions. */
    pipe<A, B, C, D, E, G, H, I>(a: $<F, A>, b: (...a: [A]) => $<F, B>, c: (...a: [B, A]) => $<F, C>, d: (...a: [C, B, A]) => $<F, D>, e: (...a: [D, C, B, A]) => $<F, E>, f: (...a: [E, D, C, B, A]) => $<F, G>, g: (...a: [G, E, D, C, B, A]) => $<F, H>, h: (...a: [H, G, E, D, C, B, A]) => $<F, I>): $<F, I>
    /** Pipes a value through multiple monadic functions. */
    pipe<A, B, C, D, E, G, H, I, J>(a: $<F, A>, b: (...a: [A]) => $<F, B>, c: (...a: [B, A]) => $<F, C>, d: (...a: [C, B, A]) => $<F, D>, e: (...a: [D, C, B, A]) => $<F, E>, f: (...a: [E, D, C, B, A]) => $<F, G>, g: (...a: [G, E, D, C, B, A]) => $<F, H>, h: (...a: [H, G, E, D, C, B, A]) => $<F, I>, i: (...a: [I, H, G, E, D, C, B, A]) => $<F, J>): $<F, J>
    /** Pipes a value through multiple monadic functions. */
    pipe<A, B, C, D, E, G, H, I, J, K>(a: $<F, A>, b: (...a: [A]) => $<F, B>, c: (...a: [B, A]) => $<F, C>, d: (...a: [C, B, A]) => $<F, D>, e: (...a: [D, C, B, A]) => $<F, E>, f: (...a: [E, D, C, B, A]) => $<F, G>, g: (...a: [G, E, D, C, B, A]) => $<F, H>, h: (...a: [H, G, E, D, C, B, A]) => $<F, I>, i: (...a: [I, H, G, E, D, C, B, A]) => $<F, J>, j: (...a: [J, I, H, G, E, D, C, B, A]) => $<F, K>): $<F, K>
    /** Pipes a value through multiple monadic functions. */
    pipe<A, B, C, D, E, G, H, I, J, K, L>(a: $<F, A>, b: (...a: [A]) => $<F, B>, c: (...a: [B, A]) => $<F, C>, d: (...a: [C, B, A]) => $<F, D>, e: (...a: [D, C, B, A]) => $<F, E>, f: (...a: [E, D, C, B, A]) => $<F, G>, g: (...a: [G, E, D, C, B, A]) => $<F, H>, h: (...a: [H, G, E, D, C, B, A]) => $<F, I>, i: (...a: [I, H, G, E, D, C, B, A]) => $<F, J>, j: (...a: [J, I, H, G, E, D, C, B, A]) => $<F, K>, k: (...a: [K, J, I, H, G, E, D, C, B, A]) => $<F, L>): $<F, L>
    /** Pipes a value through multiple monadic functions. */
    pipe<A, B, C, D, E, G, H, I, J, K, L, M>(a: $<F, A>, b: (...a: [A]) => $<F, B>, c: (...a: [B, A]) => $<F, C>, d: (...a: [C, B, A]) => $<F, D>, e: (...a: [D, C, B, A]) => $<F, E>, f: (...a: [E, D, C, B, A]) => $<F, G>, g: (...a: [G, E, D, C, B, A]) => $<F, H>, h: (...a: [H, G, E, D, C, B, A]) => $<F, I>, i: (...a: [I, H, G, E, D, C, B, A]) => $<F, J>, j: (...a: [J, I, H, G, E, D, C, B, A]) => $<F, K>, k: (...a: [K, J, I, H, G, E, D, C, B, A]) => $<F, L>, l: (...a: [L, K, J, I, H, G, E, D, C, B, A]) => $<F, M>): $<F, M>
    /** Pipes a value through multiple monadic functions. */
    pipe(a: $<F, any>, ...b: ((...a: any[]) => $<F, any>)[]): $<F, any>
    /** Chains multiple monadic functions. */
    chain<A>(): (fa: $<F, A>) => $<F, A>
    /** Chains multiple monadic functions. */
    chain<A, B>(f: (...a: [A]) => $<F, B>): (fa: $<F, A>) => $<F, B>
    /** Chains multiple monadic functions. */
    chain<A, B, C>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>): (fa: $<F, A>) => $<F, C>
    /** Chains multiple monadic functions. */
    chain<A, B, C, D>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>): (fa: $<F, A>) => $<F, D>
    /** Chains multiple monadic functions. */
    chain<A, B, C, D, E>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>): (fa: $<F, A>) => $<F, E>
    /** Chains multiple monadic functions. */
    chain<A, B, C, D, E, G>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>): (fa: $<F, A>) => $<F, G>
    /** Chains multiple monadic functions. */
    chain<A, B, C, D, E, G, H>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>): (fa: $<F, A>) => $<F, H>
    /** Chains multiple monadic functions. */
    chain<A, B, C, D, E, G, H, I>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>): (fa: $<F, A>) => $<F, I>
    /** Chains multiple monadic functions. */
    chain<A, B, C, D, E, G, H, I, J>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => $<F, J>): (fa: $<F, A>) => $<F, J>
    /** Chains multiple monadic functions. */
    chain<A, B, C, D, E, G, H, I, J, K>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => $<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => $<F, K>): (fa: $<F, A>) => $<F, K>
    /** Chains multiple monadic functions. */
    chain<A, B, C, D, E, G, H, I, J, K, L>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => $<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => $<F, K>, o: (...j: [K, J, I, H, G, E, D, C, B, A]) => $<F, L>): (fa: $<F, A>) => $<F, L>
    /** Chains multiple monadic functions. */
    chain<A, B, C, D, E, G, H, I, J, K, L, M>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => $<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => $<F, K>, o: (...j: [K, J, I, H, G, E, D, C, B, A]) => $<F, L>, p: (...k: [L, K, J, I, H, G, E, D, C, B, A]) => $<F, M>): (fa: $<F, A>) => $<F, M>
    /** Chains multiple monadic functions. */
    chain(...b: ((...a: any[]) => $<F, any>)[]): (fa: $<F, any>) => $<F, any>
}

const is_monad = Symbol("is_monad");

export type MonadArg<F> = TypeClassArg<IMonadBase<F>, IMonad<F>, typeof is_monad>;

function _monad<F>(base: MonadArg<F>): IMonad<F> {
    if (is_monad in base)
        return base;

    return _pipe(
        base,
        base => ({
            ...functor<F>({
                map: <A, B>(fa: $<F, A>, f: (a: A) => B): $<F, B> => base.bind(fa, a => base.unit(f(a))),
                ...base
            }),
            ...base
        }),
        base => {
            const lift2 = <A, B, C>(f: (a: A, b: B) => C) => (fa: $<F, A>, fb: $<F, B>): $<F, C> =>
                base.bind(fa, a => base.bind(fb, b => base.unit(f(a, b))));

            const lift3 = <A, B, C, D>(f: (a: A, b: B, c: C) => D) => (fa: $<F, A>, fb: $<F, B>, fc: $<F, C>): $<F, D> =>
                base.bind(fa, a => base.bind(fb, b => base.bind(fc, c => base.unit(f(a, b, c)))));

            const flatMap = <A, B>(f: (a: A) => $<F, B>) => (fa: $<F, A>) => base.bind(fa, f);
            const flat = <A>(ffa: $<F, $<F, A>>): $<F, A> => base.bind(ffa, id);

            const _kleisli = (...fs: ((...s: any[]) => $<F, any>)[]) =>
                fs.reduceRight((acc, f) => (...arg) => base.bind(f(...arg), a => acc(...[a, ...arg])), base.unit);

            const _pipe = (head: $<F, any>, ...tail: ((...s: any[]) => $<F, any>)[]) =>
                base.bind(head, _kleisli(...tail));

            const _chain = (...fs: ((...s: any[]) => $<F, any>)[]) => flatMap(_kleisli(...fs));

            const runFree = <A>(t: Free<A, F>): $<F, A> => {
                if (t.right) {
                    return base.bind(t.value, runFree);
                } else {
                    return base.unit(t.value);
                }
            }

            return {
                [is_monad]: true,
                lift2,
                lift3,
                flatMap,
                flat,
                fish: _kleisli,
                chain: _chain,
                pipe: _pipe,
                runFree,
                ...base
            };
        }
    );
}

/** The trivial (identity) monad. */
export type ITrivial = IMonad<$I> & ITransformer<$I>;

/** The monad factory. */
export interface IMonadFactory {
    /** Creates an `IMonad` from an `IMonadBase`. */
    <F>(base: MonadArg<F>): IMonad<F>;
    /** Creates a trivial (identity) monad. */
    readonly trivial: ITrivial;
}

_monad.trivial = {
    ..._monad<$I>({
        unit: a => a,
        bind: (fa, f) => f(fa),
        map: (fa, f) => f(fa),
    }),
    transform: <M>(inner: IMonad<M>) => monadTrans<$I, M>({ ...inner, lift: id, wrap: inner.unit })
}

/** The monad factory, providing a set of functions for working with monads. */
export const monad: IMonadFactory = _monad;
