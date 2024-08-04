import { functor, IFunctor } from "./functor.js";
import { $ } from "./hkt.js";
import { curry, flip, id } from "./utils.js";
import { pipe as _pipe } from "./utils.js";

export interface IMonadBase<F> {
    unit<A>(a: A): $<F, A>
    bind<A, B>(fa: $<F, A>, f: (a: A) => $<F, B>): $<F, B>
}

export interface IMonad<F> extends IMonadBase<F>, IFunctor<F> {
    bnid<A, B>(f: (a: A) => $<F, B>): (fa: $<F, A>) => $<F, B>
    flat<A>(ffa: $<F, $<F, A>>): $<F, A>
    sequence<A>(fas: $<F, A>[]): $<F, A[]>
    lift1<A, B>(f: (a: A) => B): (fa: $<F, A>) => $<F, B>
    lift2<A, B, C>(f: (a: A, b: B) => C): (fa: $<F, A>, fb: $<F, B>) => $<F, C>
    lift3<A, B, C, D>(f: (a: A, b: B, c: C) => D): (fa: $<F, A>, fb: $<F, B>, fc: $<F, C>) => $<F, D>
    fish<A>(): (a: A) => $<F, A>
    fish<A, B>(f: (a: A) => $<F, B>): (a: A) => $<F, B>
    fish<A, B, C>(f: (a: A) => $<F, B>, g: (b: B) => $<F, C>): (a: A) => $<F, C>
    fish<A, B, C, D>(f: (a: A) => $<F, B>, g: (b: B) => $<F, C>, h: (c: C) => $<F, D>): (a: A) => $<F, D>
    fish<A, B, C, D, E>(f: (a: A) => $<F, B>, g: (b: B) => $<F, C>, h: (c: C) => $<F, D>, i: (d: D) => $<F, E>): (a: A) => $<F, E>
    fish<A, B, C, D, E, G>(f: (a: A) => $<F, B>, g: (b: B) => $<F, C>, h: (c: C) => $<F, D>, i: (d: D) => $<F, E>, j: (e: E) => $<F, G>): (a: A) => $<F, G>
    fish<A, B, C, D, E, G, H>(f: (a: A) => $<F, B>, g: (b: B) => $<F, C>, h: (c: C) => $<F, D>, i: (d: D) => $<F, E>, j: (e: E) => $<F, G>, k: (f: G) => $<F, H>): (a: A) => $<F, H>
    fish<A, B, C, D, E, G, H, I>(f: (a: A) => $<F, B>, g: (b: B) => $<F, C>, h: (c: C) => $<F, D>, i: (d: D) => $<F, E>, j: (e: E) => $<F, G>, k: (f: G) => $<F, H>, l: (g: H) => $<F, I>): (a: A) => $<F, I>
    fish<A, B, C, D, E, G, H, I, J>(f: (a: A) => $<F, B>, g: (b: B) => $<F, C>, h: (c: C) => $<F, D>, i: (d: D) => $<F, E>, j: (e: E) => $<F, G>, k: (f: G) => $<F, H>, l: (g: H) => $<F, I>, m: (h: I) => $<F, J>): (a: A) => $<F, J>
    fish<A, B, C, D, E, G, H, I, J, K>(f: (a: A) => $<F, B>, g: (b: B) => $<F, C>, h: (c: C) => $<F, D>, i: (d: D) => $<F, E>, j: (e: E) => $<F, G>, k: (f: G) => $<F, H>, l: (g: H) => $<F, I>, m: (h: I) => $<F, J>, n: (i: J) => $<F, K>): (a: A) => $<F, K>
    fish<A, B, C, D, E, G, H, I, J, K, L>(f: (a: A) => $<F, B>, g: (b: B) => $<F, C>, h: (c: C) => $<F, D>, i: (d: D) => $<F, E>, j: (e: E) => $<F, G>, k: (f: G) => $<F, H>, l: (g: H) => $<F, I>, m: (h: I) => $<F, J>, n: (i: J) => $<F, K>, o: (j: K) => $<F, L>): (a: A) => $<F, L>
    fish<A, B, C, D, E, G, H, I, J, K, L, M>(f: (a: A) => $<F, B>, g: (b: B) => $<F, C>, h: (c: C) => $<F, D>, i: (d: D) => $<F, E>, j: (e: E) => $<F, G>, k: (f: G) => $<F, H>, l: (g: H) => $<F, I>, m: (h: I) => $<F, J>, n: (i: J) => $<F, K>, o: (j: K) => $<F, L>, p: (k: L) => $<F, M>): (a: A) => $<F, M>
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
            const bnid = <A, B>(f: (a: A) => $<F, B>) => (fa: $<F, A>) => base.bind(fa, f);
            const flat = <A>(ffa: $<F, $<F, A>>): $<F, A> => base.bind(ffa, id);

            const sequence = <A>(fas: $<F, A>[]): $<F, A[]> => 
                fas.reduceRight((acc, fa) => base.bind(fa, a => base.map(acc, as => [a, ...as])), base.unit([] as A[]));
        
            const _kleisli = (...fs: ((...s: any[]) => $<F, any>)[]) => 
                fs.reduceRight((acc, f) => (...arg) => base.bind(f(...arg), a => acc(...[a, ...arg])), base.unit);
 
            const _pipe = (head: $<F, any>, ...tail: ((...s: any[]) => $<F, any>)[]) => 
                base.bind(head, _kleisli(...tail));

            const _chain = (...fs: ((...s: any[]) => $<F, any>)[]) => bnid(_kleisli(...fs));

            const lift1 = base.fmap;
            const lift2 = <A, B, C>(f: (a: A, b: B) => C) => (fa: $<F, A>, fb: $<F, B>) => base.bind(fa, a => base.map(fb, b => f(a, b)));
            const lift3 = <A, B, C, D>(f: (a: A, b: B, c: C) => D) => (fa: $<F, A>, fb: $<F, B>, fc: $<F, C>) => base.bind(fa, a => base.bind(fb, b => base.map(fc, c => f(a, b, c))));

            return {
                bnid,
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
                ...base
            };
        }
    );
}
