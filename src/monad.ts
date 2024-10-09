import { KArray } from "./array.js";
import { functor, IFunctor } from "./functor.js";
import { $ } from "./hkt.js";
import { curry, flip, id } from "./utils.js";
import { pipe as _pipe } from "./utils.js";

export interface IMonadBase<F> {
    unit<A>(a: A): $<F, A>
    bind<A, B>(fa: $<F, A>, f: (a: A) => $<F, B>): $<F, B>
}

export interface IMonad<F> extends IMonadBase<F>, IFunctor<F> {
    flatMap<A, B>(f: (a: A) => $<F, B>): (fa: $<F, A>) => $<F, B>
    flat<A>(ffa: $<F, $<F, A>>): $<F, A>
    sequence(fas: readonly []): $<F, []>
    sequence<A>(fas: readonly [$<F, A>]): $<F, [A]>
    sequence<A, B>(fas: readonly [$<F, A>, $<F, B>]): $<F, [A, B]>
    sequence<A, B, C>(fas: readonly [$<F, A>, $<F, B>, $<F, C>]): $<F, [A, B, C]>
    sequence<A, B, C, D>(fas: readonly [$<F, A>, $<F, B>, $<F, C>, $<F, D>]): $<F, [A, B, C, D]>
    sequence<A, B, C, D, E>(fas: readonly [$<F, A>, $<F, B>, $<F, C>, $<F, D>, $<F, E>]): $<F, [A, B, C, D, E]>
    sequence<A, B, C, D, E, G>(fas: readonly [$<F, A>, $<F, B>, $<F, C>, $<F, D>, $<F, E>, $<F, G>]): $<F, [A, B, C, D, E, G]>
    sequence<A, B, C, D, E, G, H>(fas: readonly [$<F, A>, $<F, B>, $<F, C>, $<F, D>, $<F, E>, $<F, G>, $<F, H>]): $<F, [A, B, C, D, E, G, H]>
    sequence<A, B, C, D, E, G, H, I>(fas: readonly [$<F, A>, $<F, B>, $<F, C>, $<F, D>, $<F, E>, $<F, G>, $<F, H>, $<F, I>]): $<F, [A, B, C, D, E, G, H, I]>
    sequence<A, B, C, D, E, G, H, I, J>(fas: readonly [$<F, A>, $<F, B>, $<F, C>, $<F, D>, $<F, E>, $<F, G>, $<F, H>, $<F, I>, $<F, J>]): $<F, [A, B, C, D, E, G, H, I, J]>
    sequence<A, B, C, D, E, G, H, I, J, K>(fas: readonly [$<F, A>, $<F, B>, $<F, C>, $<F, D>, $<F, E>, $<F, G>, $<F, H>, $<F, I>, $<F, J>, $<F, K>]): $<F, [A, B, C, D, E, G, H, I, J, K]>
    sequence<A, B, C, D, E, G, H, I, J, K, L>(fas: readonly [$<F, A>, $<F, B>, $<F, C>, $<F, D>, $<F, E>, $<F, G>, $<F, H>, $<F, I>, $<F, J>, $<F, K>, $<F, L>]): $<F, [A, B, C, D, E, G, H, I, J, K, L]>
    sequence<A, B, C, D, E, G, H, I, J, K, L, M>(fas: readonly [$<F, A>, $<F, B>, $<F, C>, $<F, D>, $<F, E>, $<F, G>, $<F, H>, $<F, I>, $<F, J>, $<F, K>, $<F, L>, $<F, M>]): $<F, [A, B, C, D, E, G, H, I, J, K, L, M]>
    sequence<A>(fas: $<F, A>[]): $<F, A[]>
    lift1<A, B>(f: (a: A) => B): (fa: $<F, A>) => $<F, B>
    lift2<A, B, C>(f: (a: A, b: B) => C): (fa: $<F, A>, fb: $<F, B>) => $<F, C>
    lift3<A, B, C, D>(f: (a: A, b: B, c: C) => D): (fa: $<F, A>, fb: $<F, B>, fc: $<F, C>) => $<F, D>
    fish<A>(): (...a: [A]) => $<F, A>
    fish<A, B>(f: (...a: [A]) => $<F, B>): (...a: [A]) => $<F, B>
    fish<A, B, C>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>): (a: A) => $<F, C>
    fish<A, B, C, D>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>): (a: A) => $<F, D>
    fish<A, B, C, D, E>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>): (a: A) => $<F, E>
    fish<A, B, C, D, E, G>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>): (a: A) => $<F, G>
    fish<A, B, C, D, E, G, H>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>): (a: A) => $<F, H>
    fish<A, B, C, D, E, G, H, I>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>): (a: A) => $<F, I>
    fish<A, B, C, D, E, G, H, I, J>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => $<F, J>): (a: A) => $<F, J>
    fish<A, B, C, D, E, G, H, I, J, K>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => $<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => $<F, K>): (a: A) => $<F, K>
    fish<A, B, C, D, E, G, H, I, J, K, L>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => $<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => $<F, K>, o: (...j: [K, J, I, H, G, E, D, C, B, A]) => $<F, L>): (a: A) => $<F, L>
    fish<A, B, C, D, E, G, H, I, J, K, L, M>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => $<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => $<F, K>, o: (...j: [K, J, I, H, G, E, D, C, B, A]) => $<F, L>, p: (...k: [L, K, J, I, H, G, E, D, C, B, A]) => $<F, M>): (a: A) => $<F, M>
    _fish(...b: ((...a: any[]) => $<F, any>)[]): (...s: any[]) => $<F, any>
    pipe<A>(a: $<F, A>): $<F, A>
    pipe<A, B>(a: $<F, A>, b:(...a: [A]) => $<F, B>): $<F, B>
    pipe<A, B, C>(a: $<F, A>, b:(...a: [A]) => $<F, B>, c:(...a: [B, A]) => $<F, C>): $<F, C>
    pipe<A, B, C, D>(a: $<F, A>, b:(...a: [A]) => $<F, B>, c:(...a: [B, A]) => $<F, C>, d:(...a: [C, B, A]) => $<F, D>): $<F, D>
    pipe<A, B, C, D, E>(a: $<F, A>, b:(...a: [A]) => $<F, B>, c:(...a: [B, A]) => $<F, C>, d:(...a: [C, B, A]) => $<F, D>, e:(...a: [D, C, B, A]) => $<F, E>): $<F, E>
    pipe<A, B, C, D, E, G>(a: $<F, A>, b:(...a: [A]) => $<F, B>, c:(...a: [B, A]) => $<F, C>, d:(...a: [C, B, A]) => $<F, D>, e:(...a: [D, C, B, A]) => $<F, E>, f:(...a: [E, D, C, B, A]) => $<F, G>): $<F, G>
    pipe<A, B, C, D, E, G, H>(a: $<F, A>, b:(...a: [A]) => $<F, B>, c:(...a: [B, A]) => $<F, C>, d:(...a: [C, B, A]) => $<F, D>, e:(...a: [D, C, B, A]) => $<F, E>, f:(...a: [E, D, C, B, A]) => $<F, G>, g:(...a: [G, E, D, C, B, A]) => $<F, H>): $<F, H>
    pipe<A, B, C, D, E, G, H, I>(a: $<F, A>, b:(...a: [A]) => $<F, B>, c:(...a: [B, A]) => $<F, C>, d:(...a: [C, B, A]) => $<F, D>, e:(...a: [D, C, B, A]) => $<F, E>, f:(...a: [E, D, C, B, A]) => $<F, G>, g:(...a: [G, E, D, C, B, A]) => $<F, H>, h:(...a: [H, G, E, D, C, B, A]) => $<F, I>): $<F, I>
    pipe<A, B, C, D, E, G, H, I, J>(a: $<F, A>, b:(...a: [A]) => $<F, B>, c:(...a: [B, A]) => $<F, C>, d:(...a: [C, B, A]) => $<F, D>, e:(...a: [D, C, B, A]) => $<F, E>, f:(...a: [E, D, C, B, A]) => $<F, G>, g:(...a: [G, E, D, C, B, A]) => $<F, H>, h:(...a: [H, G, E, D, C, B, A]) => $<F, I>, i:(...a: [I, H, G, E, D, C, B, A]) => $<F, J>): $<F, J>
    pipe<A, B, C, D, E, G, H, I, J, K>(a: $<F, A>, b:(...a: [A]) => $<F, B>, c:(...a: [B, A]) => $<F, C>, d:(...a: [C, B, A]) => $<F, D>, e:(...a: [D, C, B, A]) => $<F, E>, f:(...a: [E, D, C, B, A]) => $<F, G>, g:(...a: [G, E, D, C, B, A]) => $<F, H>, h:(...a: [H, G, E, D, C, B, A]) => $<F, I>, i:(...a: [I, H, G, E, D, C, B, A]) => $<F, J>, j:(...a: [J, I, H, G, E, D, C, B, A]) => $<F, K>): $<F, K>
    pipe<A, B, C, D, E, G, H, I, J, K, L>(a: $<F, A>, b:(...a: [A]) => $<F, B>, c:(...a: [B, A]) => $<F, C>, d:(...a: [C, B, A]) => $<F, D>, e:(...a: [D, C, B, A]) => $<F, E>, f:(...a: [E, D, C, B, A]) => $<F, G>, g:(...a: [G, E, D, C, B, A]) => $<F, H>, h:(...a: [H, G, E, D, C, B, A]) => $<F, I>, i:(...a: [I, H, G, E, D, C, B, A]) => $<F, J>, j:(...a: [J, I, H, G, E, D, C, B, A]) => $<F, K>, k:(...a: [K, J, I, H, G, E, D, C, B, A]) => $<F, L>): $<F, L>
    pipe<A, B, C, D, E, G, H, I, J, K, L, M>(a: $<F, A>, b:(...a: [A]) => $<F, B>, c:(...a: [B, A]) => $<F, C>, d:(...a: [C, B, A]) => $<F, D>, e:(...a: [D, C, B, A]) => $<F, E>, f:(...a: [E, D, C, B, A]) => $<F, G>, g:(...a: [G, E, D, C, B, A]) => $<F, H>, h:(...a: [H, G, E, D, C, B, A]) => $<F, I>, i:(...a: [I, H, G, E, D, C, B, A]) => $<F, J>, j:(...a: [J, I, H, G, E, D, C, B, A]) => $<F, K>, k:(...a: [K, J, I, H, G, E, D, C, B, A]) => $<F, L>, l:(...a: [L, K, J, I, H, G, E, D, C, B, A]) => $<F, M>): $<F, M>        
    _pipe(a: $<F, any>, ...b: ((...a: any[]) => $<F, any>)[]): $<F, any>
    do<A>(a: $<F, A>): $<F, A>
    do<A, B>(a: $<F, A>, b:$<F, B>): $<F, B>
    do<A, B, C>(a: $<F, A>, b:$<F, B>, c:$<F, C>): $<F, C>
    do<A, B, C, D>(a: $<F, A>, b:$<F, B>, c:$<F, C>, d:$<F, D>): $<F, D>
    do<A, B, C, D, E>(a: $<F, A>, b:$<F, B>, c:$<F, C>, d:$<F, D>, e:$<F, E>): $<F, E>
    do<A, B, C, D, E, G>(a: $<F, A>, b:$<F, B>, c:$<F, C>, d:$<F, D>, e:$<F, E>, f:$<F, G>): $<F, G>
    do<A, B, C, D, E, G, H>(a: $<F, A>, b:$<F, B>, c:$<F, C>, d:$<F, D>, e:$<F, E>, f:$<F, G>, g:$<F, H>): $<F, H>
    do<A, B, C, D, E, G, H, I>(a: $<F, A>, b:$<F, B>, c:$<F, C>, d:$<F, D>, e:$<F, E>, f:$<F, G>, g:$<F, H>, h:$<F, I>): $<F, I>
    do<A, B, C, D, E, G, H, I, J>(a: $<F, A>, b:$<F, B>, c:$<F, C>, d:$<F, D>, e:$<F, E>, f:$<F, G>, g:$<F, H>, h:$<F, I>, i:$<F, J>): $<F, J>
    do<A, B, C, D, E, G, H, I, J, K>(a: $<F, A>, b:$<F, B>, c:$<F, C>, d:$<F, D>, e:$<F, E>, f:$<F, G>, g:$<F, H>, h:$<F, I>, i:$<F, J>, j:$<F, K>): $<F, K>
    do<A, B, C, D, E, G, H, I, J, K, L>(a: $<F, A>, b:$<F, B>, c:$<F, C>, d:$<F, D>, e:$<F, E>, f:$<F, G>, g:$<F, H>, h:$<F, I>, i:$<F, J>, j:$<F, K>, k:$<F, L>): $<F, L>
    do<A, B, C, D, E, G, H, I, J, K, L, M>(a: $<F, A>, b:$<F, B>, c:$<F, C>, d:$<F, D>, e:$<F, E>, f:$<F, G>, g:$<F, H>, h:$<F, I>, i:$<F, J>, j:$<F, K>, k:$<F, L>, l:$<F, M>): $<F, M>
    _do(...as: $<F, any>[]): $<F, any>
    chain<A>(): (fa: $<F, A>) => $<F, A>
    chain<A, B>(f: (...a: [A]) => $<F, B>): (fa: $<F, A>) => $<F, B>
    chain<A, B, C>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>): (fa: $<F, A>) => $<F, C>
    chain<A, B, C, D>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>): (fa: $<F, A>) => $<F, D>
    chain<A, B, C, D, E>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>): (fa: $<F, A>) => $<F, E>
    chain<A, B, C, D, E, G>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>): (fa: $<F, A>) => $<F, G>
    chain<A, B, C, D, E, G, H>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>): (fa: $<F, A>) => $<F, H>
    chain<A, B, C, D, E, G, H, I>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>): (fa: $<F, A>) => $<F, I>
    chain<A, B, C, D, E, G, H, I, J>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => $<F, J>): (fa: $<F, A>) => $<F, J>
    chain<A, B, C, D, E, G, H, I, J, K>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => $<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => $<F, K>): (fa: $<F, A>) => $<F, K>
    chain<A, B, C, D, E, G, H, I, J, K, L>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => $<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => $<F, K>, o: (...j: [K, J, I, H, G, E, D, C, B, A]) => $<F, L>): (fa: $<F, A>) => $<F, L>
    chain<A, B, C, D, E, G, H, I, J, K, L, M>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => $<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => $<F, K>, o: (...j: [K, J, I, H, G, E, D, C, B, A]) => $<F, L>, p: (...k: [L, K, J, I, H, G, E, D, C, B, A]) => $<F, M>): (fa: $<F, A>) => $<F, M>        
    _chain(...b: ((...a: any[]) => $<F, any>)[]): (fa: $<F, any>) => $<F, any>
}

export function monad<F>(base: IMonadBase<F> & Partial<IMonad<F>>): IMonad<F> {
    return _pipe(
        base,
        base => {
            return {
                map: <A, B>(fa: $<F, A>, f: (a: A) => B): $<F, B> => base.bind(fa, a => base.unit(f(a))),
                ...base
            };
        },
        base => {
            return { 
                ...functor<F>(base), 
                ...base 
            };
        },
        base => {
            const flatMap = <A, B>(f: (a: A) => $<F, B>) => (fa: $<F, A>) => base.bind(fa, f);
            const flat = <A>(ffa: $<F, $<F, A>>): $<F, A> => base.bind(ffa, id);

            const sequence = (fas: readonly $<F, any>[]): any => 
                fas.reduceRight((acc, fa) => base.bind(fa, a => base.map(acc, as => [a, ...as])), base.unit([] as any[]));
        
            const _kleisli = (...fs: ((...s: any[]) => $<F, any>)[]) => 
                fs.reduceRight((acc, f) => (...arg) => base.bind(f(...arg), a => acc(...[a, ...arg])), base.unit);
 
            const _pipe = (head: $<F, any>, ...tail: ((...s: any[]) => $<F, any>)[]) => 
                base.bind(head, _kleisli(...tail));

            const _chain = (...fs: ((...s: any[]) => $<F, any>)[]) => flatMap(_kleisli(...fs));

            const _do = (head: $<F, any>, ...tail: $<F, any>[]) => _pipe(head, ...tail.map(v => (_: any) => v));

            const lift1 = base.fmap;
            const lift2 = <A, B, C>(f: (a: A, b: B) => C) => (fa: $<F, A>, fb: $<F, B>) => base.bind(fa, a => base.map(fb, b => f(a, b)));
            const lift3 = <A, B, C, D>(f: (a: A, b: B, c: C) => D) => (fa: $<F, A>, fb: $<F, B>, fc: $<F, C>) => base.bind(fa, a => base.bind(fb, b => base.map(fc, c => f(a, b, c))));

            return {
                flatMap,
                flat,
                _fish: _kleisli,
                fish: _kleisli,
                _chain,
                chain: _chain,
                sequence,
                lift1,
                lift2,
                lift3,
                _pipe,
                pipe: _pipe,
                _do,
                do: _do,
                ...base
            };
        }
    );
}
