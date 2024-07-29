import { functor, IFunctor } from "./functor.js";
import { $ } from "./hkt.js";
import { id } from "./utils.js";
import { pipe as _pipe } from "./utils.js";

export interface IMonadBase<F> {
    unit<A>(a: A): $<F, A>
    bind<A, B>(fa: $<F, A>, f: (a: A) => $<F, B>): $<F, B>
}

export interface IMonad<F> extends IMonadBase<F>, IFunctor<F> {
    flat<A>(ffa: $<F, $<F, A>>): $<F, A>
    sequence<A>(fas: $<F, A>[]): $<F, A[]>
    lift1<A, B>(f: (a: A) => B): (fa: $<F, A>) => $<F, B>
    lift2<A, B, C>(f: (a: A, b: B) => C): (fa: $<F, A>, fb: $<F, B>) => $<F, C>
    lift3<A, B, C, D>(f: (a: A, b: B, c: C) => D): (fa: $<F, A>, fb: $<F, B>, fc: $<F, C>) => $<F, D>
    pipe: {
        <A>(a: $<F, A>): $<F, A>
        <A, B>(a: $<F, A>, b:(...a: [A]) => $<F, B>): $<F, B>
        <A, B, C>(a: $<F, A>, b:(...a: [A]) => $<F, B>, c:(...a: [B, A]) => $<F, C>): $<F, C>
        <A, B, C, D>(a: $<F, A>, b:(...a: [A]) => $<F, B>, c:(...a: [B, A]) => $<F, C>, d:(...a: [C, B, A]) => $<F, D>): $<F, D>
        <A, B, C, D, E>(a: $<F, A>, b:(...a: [A]) => $<F, B>, c:(...a: [B, A]) => $<F, C>, d:(...a: [C, B, A]) => $<F, D>, e:(...a: [D, C, B, A]) => $<F, E>): $<F, E>
        <A, B, C, D, E, G>(a: $<F, A>, b:(...a: [A]) => $<F, B>, c:(...a: [B, A]) => $<F, C>, d:(...a: [C, B, A]) => $<F, D>, e:(...a: [D, C, B, A]) => $<F, E>, f:(...a: [E, D, C, B, A]) => $<F, G>): $<F, G>
        <A, B, C, D, E, G, H>(a: $<F, A>, b:(...a: [A]) => $<F, B>, c:(...a: [B, A]) => $<F, C>, d:(...a: [C, B, A]) => $<F, D>, e:(...a: [D, C, B, A]) => $<F, E>, f:(...a: [E, D, C, B, A]) => $<F, G>, g:(...a: [G, E, D, C, B, A]) => $<F, H>): $<F, H>
        <A, B, C, D, E, G, H, I>(a: $<F, A>, b:(...a: [A]) => $<F, B>, c:(...a: [B, A]) => $<F, C>, d:(...a: [C, B, A]) => $<F, D>, e:(...a: [D, C, B, A]) => $<F, E>, f:(...a: [E, D, C, B, A]) => $<F, G>, g:(...a: [G, E, D, C, B, A]) => $<F, H>, h:(...a: [H, G, E, D, C, B, A]) => $<F, I>): $<F, I>
        <A, B, C, D, E, G, H, I, J>(a: $<F, A>, b:(...a: [A]) => $<F, B>, c:(...a: [B, A]) => $<F, C>, d:(...a: [C, B, A]) => $<F, D>, e:(...a: [D, C, B, A]) => $<F, E>, f:(...a: [E, D, C, B, A]) => $<F, G>, g:(...a: [G, E, D, C, B, A]) => $<F, H>, h:(...a: [H, G, E, D, C, B, A]) => $<F, I>, i:(...a: [I, H, G, E, D, C, B, A]) => $<F, J>): $<F, J>
        <A, B, C, D, E, G, H, I, J, K>(a: $<F, A>, b:(...a: [A]) => $<F, B>, c:(...a: [B, A]) => $<F, C>, d:(...a: [C, B, A]) => $<F, D>, e:(...a: [D, C, B, A]) => $<F, E>, f:(...a: [E, D, C, B, A]) => $<F, G>, g:(...a: [G, E, D, C, B, A]) => $<F, H>, h:(...a: [H, G, E, D, C, B, A]) => $<F, I>, i:(...a: [I, H, G, E, D, C, B, A]) => $<F, J>, j:(...a: [J, I, H, G, E, D, C, B, A]) => $<F, K>): $<F, K>
        <A, B, C, D, E, G, H, I, J, K, L>(a: $<F, A>, b:(...a: [A]) => $<F, B>, c:(...a: [B, A]) => $<F, C>, d:(...a: [C, B, A]) => $<F, D>, e:(...a: [D, C, B, A]) => $<F, E>, f:(...a: [E, D, C, B, A]) => $<F, G>, g:(...a: [G, E, D, C, B, A]) => $<F, H>, h:(...a: [H, G, E, D, C, B, A]) => $<F, I>, i:(...a: [I, H, G, E, D, C, B, A]) => $<F, J>, j:(...a: [J, I, H, G, E, D, C, B, A]) => $<F, K>, k:(...a: [K, J, I, H, G, E, D, C, B, A]) => $<F, L>): $<F, L>
        <A, B, C, D, E, G, H, I, J, K, L, M>(a: $<F, A>, b:(...a: [A]) => $<F, B>, c:(...a: [B, A]) => $<F, C>, d:(...a: [C, B, A]) => $<F, D>, e:(...a: [D, C, B, A]) => $<F, E>, f:(...a: [E, D, C, B, A]) => $<F, G>, g:(...a: [G, E, D, C, B, A]) => $<F, H>, h:(...a: [H, G, E, D, C, B, A]) => $<F, I>, i:(...a: [I, H, G, E, D, C, B, A]) => $<F, J>, j:(...a: [J, I, H, G, E, D, C, B, A]) => $<F, K>, k:(...a: [K, J, I, H, G, E, D, C, B, A]) => $<F, L>, l:(...a: [L, K, J, I, H, G, E, D, C, B, A]) => $<F, M>): $<F, M>
    }
    chain: {
        <A>(): (fa: $<F, A>) => $<F, A>
        <A, B>(f: (...a: [A]) => $<F, B>): (fa: $<F, A>) => $<F, B>
        <A, B, C>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>): (fa: $<F, A>) => $<F, C>
        <A, B, C, D>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>): (fa: $<F, A>) => $<F, D>
        <A, B, C, D, E>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>): (fa: $<F, A>) => $<F, E>
        <A, B, C, D, E, G>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>): (fa: $<F, A>) => $<F, G>
        <A, B, C, D, E, G, H>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>): (fa: $<F, A>) => $<F, H>
        <A, B, C, D, E, G, H, I>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>): (fa: $<F, A>) => $<F, I>
        <A, B, C, D, E, G, H, I, J>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => $<F, J>): (fa: $<F, A>) => $<F, J>
        <A, B, C, D, E, G, H, I, J, K>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => $<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => $<F, K>): (fa: $<F, A>) => $<F, K>
        <A, B, C, D, E, G, H, I, J, K, L>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => $<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => $<F, K>, o: (...j: [K, J, I, H, G, E, D, C, B, A]) => $<F, L>): (fa: $<F, A>) => $<F, L>
        <A, B, C, D, E, G, H, I, J, K, L, M>(f: (...a: [A]) => $<F, B>, g: (...b: [B, A]) => $<F, C>, h: (...c: [C, B, A]) => $<F, D>, i: (...d: [D, C, B, A]) => $<F, E>, j: (...e: [E, D, C, B, A]) => $<F, G>, k: (...f: [G, E, D, C, B, A]) => $<F, H>, l: (...g: [H, G, E, D, C, B, A]) => $<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => $<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => $<F, K>, o: (...j: [K, J, I, H, G, E, D, C, B, A]) => $<F, L>, p: (...k: [L, K, J, I, H, G, E, D, C, B, A]) => $<F, M>): (fa: $<F, A>) => $<F, M>
    }
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
            const flat = <A>(ffa: $<F, $<F, A>>): $<F, A> => base.bind(ffa, id);

            const sequence = <A>(fas: $<F, A>[]): $<F, A[]> => 
                fas.reduceRight((acc, fa) => base.bind(fa, a => base.map(acc, as => [a, ...as])), base.unit([] as A[]));
        
            const pipe = (head: $<F, any>, ...tail: ((...s: any[]) => $<F, any>)[]) => 
                base.bind(head, tail.reduceRight((acc, f) => (...arg) => base.bind(f(...arg), a => acc(...[a, ...arg])), base.unit));
        
            const chain = (...fs: ((...s: any[]) => $<F, any>)[]) =>
                (m: $<F, any>) => pipe(m, ...fs);

            const lift1 = base.fmap;
            const lift2 = <A, B, C>(f: (a: A, b: B) => C) => (fa: $<F, A>, fb: $<F, B>) => base.bind(fa, a => base.map(fb, b => f(a, b)));
            const lift3 = <A, B, C, D>(f: (a: A, b: B, c: C) => D) => (fa: $<F, A>, fb: $<F, B>, fc: $<F, C>) => base.bind(fa, a => base.bind(fb, b => base.map(fc, c => f(a, b, c))));

            return {
                flat,
                chain,
                sequence,
                lift1,
                lift2,
                lift3,
                pipe,
                ...base
            };
        }
    );
}
