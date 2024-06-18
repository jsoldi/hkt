import { ITypeClass, KApp, KType } from "./hkt.js";

export interface IMonadBase<F> extends ITypeClass<F> {
    unit<A>(a: A): KApp<F, A>
    bind<A, B>(fa: KApp<F, A>, f: (a: A) => KApp<F, B>): KApp<F, B>
}

export interface IMonad<F> extends IMonadBase<F> {
    map<A, B>(fa: KApp<F, A>, f: (a: A) => B): KApp<F, B>
    join<A>(ffa: KApp<F, KApp<F, A>>): KApp<F, A>
    sequence<A>(fas: KApp<F, A>[]): KApp<F, A[]>
    pipe: {
        <A>(a: KApp<F, A>): KApp<F, A>
        <A, B>(a: KApp<F, A>, b:(...a: [A]) => KApp<F, B>): KApp<F, B>
        <A, B, C>(a: KApp<F, A>, b:(...a: [A]) => KApp<F, B>, c:(...a: [B, A]) => KApp<F, C>): KApp<F, C>
        <A, B, C, D>(a: KApp<F, A>, b:(...a: [A]) => KApp<F, B>, c:(...a: [B, A]) => KApp<F, C>, d:(...a: [C, B, A]) => KApp<F, D>): KApp<F, D>
        <A, B, C, D, E>(a: KApp<F, A>, b:(...a: [A]) => KApp<F, B>, c:(...a: [B, A]) => KApp<F, C>, d:(...a: [C, B, A]) => KApp<F, D>, e:(...a: [D, C, B, A]) => KApp<F, E>): KApp<F, E>
        <A, B, C, D, E, G>(a: KApp<F, A>, b:(...a: [A]) => KApp<F, B>, c:(...a: [B, A]) => KApp<F, C>, d:(...a: [C, B, A]) => KApp<F, D>, e:(...a: [D, C, B, A]) => KApp<F, E>, f:(...a: [E, D, C, B, A]) => KApp<F, G>): KApp<F, G>
        <A, B, C, D, E, G, H>(a: KApp<F, A>, b:(...a: [A]) => KApp<F, B>, c:(...a: [B, A]) => KApp<F, C>, d:(...a: [C, B, A]) => KApp<F, D>, e:(...a: [D, C, B, A]) => KApp<F, E>, f:(...a: [E, D, C, B, A]) => KApp<F, G>, g:(...a: [G, E, D, C, B, A]) => KApp<F, H>): KApp<F, H>
        <A, B, C, D, E, G, H, I>(a: KApp<F, A>, b:(...a: [A]) => KApp<F, B>, c:(...a: [B, A]) => KApp<F, C>, d:(...a: [C, B, A]) => KApp<F, D>, e:(...a: [D, C, B, A]) => KApp<F, E>, f:(...a: [E, D, C, B, A]) => KApp<F, G>, g:(...a: [G, E, D, C, B, A]) => KApp<F, H>, h:(...a: [H, G, E, D, C, B, A]) => KApp<F, I>): KApp<F, I>
        <A, B, C, D, E, G, H, I, J>(a: KApp<F, A>, b:(...a: [A]) => KApp<F, B>, c:(...a: [B, A]) => KApp<F, C>, d:(...a: [C, B, A]) => KApp<F, D>, e:(...a: [D, C, B, A]) => KApp<F, E>, f:(...a: [E, D, C, B, A]) => KApp<F, G>, g:(...a: [G, E, D, C, B, A]) => KApp<F, H>, h:(...a: [H, G, E, D, C, B, A]) => KApp<F, I>, i:(...a: [I, H, G, E, D, C, B, A]) => KApp<F, J>): KApp<F, J>
        <A, B, C, D, E, G, H, I, J, K>(a: KApp<F, A>, b:(...a: [A]) => KApp<F, B>, c:(...a: [B, A]) => KApp<F, C>, d:(...a: [C, B, A]) => KApp<F, D>, e:(...a: [D, C, B, A]) => KApp<F, E>, f:(...a: [E, D, C, B, A]) => KApp<F, G>, g:(...a: [G, E, D, C, B, A]) => KApp<F, H>, h:(...a: [H, G, E, D, C, B, A]) => KApp<F, I>, i:(...a: [I, H, G, E, D, C, B, A]) => KApp<F, J>, j:(...a: [J, I, H, G, E, D, C, B, A]) => KApp<F, K>): KApp<F, K>
        <A, B, C, D, E, G, H, I, J, K, L>(a: KApp<F, A>, b:(...a: [A]) => KApp<F, B>, c:(...a: [B, A]) => KApp<F, C>, d:(...a: [C, B, A]) => KApp<F, D>, e:(...a: [D, C, B, A]) => KApp<F, E>, f:(...a: [E, D, C, B, A]) => KApp<F, G>, g:(...a: [G, E, D, C, B, A]) => KApp<F, H>, h:(...a: [H, G, E, D, C, B, A]) => KApp<F, I>, i:(...a: [I, H, G, E, D, C, B, A]) => KApp<F, J>, j:(...a: [J, I, H, G, E, D, C, B, A]) => KApp<F, K>, k:(...a: [K, J, I, H, G, E, D, C, B, A]) => KApp<F, L>): KApp<F, L>
        <A, B, C, D, E, G, H, I, J, K, L, M>(a: KApp<F, A>, b:(...a: [A]) => KApp<F, B>, c:(...a: [B, A]) => KApp<F, C>, d:(...a: [C, B, A]) => KApp<F, D>, e:(...a: [D, C, B, A]) => KApp<F, E>, f:(...a: [E, D, C, B, A]) => KApp<F, G>, g:(...a: [G, E, D, C, B, A]) => KApp<F, H>, h:(...a: [H, G, E, D, C, B, A]) => KApp<F, I>, i:(...a: [I, H, G, E, D, C, B, A]) => KApp<F, J>, j:(...a: [J, I, H, G, E, D, C, B, A]) => KApp<F, K>, k:(...a: [K, J, I, H, G, E, D, C, B, A]) => KApp<F, L>, l:(...a: [L, K, J, I, H, G, E, D, C, B, A]) => KApp<F, M>): KApp<F, M>
    }
    chain: {
        <A, B>(f: (...a: [A]) => KApp<F, B>): (fa: KApp<F, A>) => KApp<F, B>
        <A, B, C>(f: (...a: [A]) => KApp<F, B>, g: (...b: [B, A]) => KApp<F, C>): (fa: KApp<F, A>) => KApp<F, C>
        <A, B, C, D>(f: (...a: [A]) => KApp<F, B>, g: (...b: [B, A]) => KApp<F, C>, h: (...c: [C, B, A]) => KApp<F, D>): (fa: KApp<F, A>) => KApp<F, D>
        <A, B, C, D, E>(f: (...a: [A]) => KApp<F, B>, g: (...b: [B, A]) => KApp<F, C>, h: (...c: [C, B, A]) => KApp<F, D>, i: (...d: [D, C, B, A]) => KApp<F, E>): (fa: KApp<F, A>) => KApp<F, E>
        <A, B, C, D, E, G>(f: (...a: [A]) => KApp<F, B>, g: (...b: [B, A]) => KApp<F, C>, h: (...c: [C, B, A]) => KApp<F, D>, i: (...d: [D, C, B, A]) => KApp<F, E>, j: (...e: [E, D, C, B, A]) => KApp<F, G>): (fa: KApp<F, A>) => KApp<F, G>
        <A, B, C, D, E, G, H>(f: (...a: [A]) => KApp<F, B>, g: (...b: [B, A]) => KApp<F, C>, h: (...c: [C, B, A]) => KApp<F, D>, i: (...d: [D, C, B, A]) => KApp<F, E>, j: (...e: [E, D, C, B, A]) => KApp<F, G>, k: (...f: [G, E, D, C, B, A]) => KApp<F, H>): (fa: KApp<F, A>) => KApp<F, H>
        <A, B, C, D, E, G, H, I>(f: (...a: [A]) => KApp<F, B>, g: (...b: [B, A]) => KApp<F, C>, h: (...c: [C, B, A]) => KApp<F, D>, i: (...d: [D, C, B, A]) => KApp<F, E>, j: (...e: [E, D, C, B, A]) => KApp<F, G>, k: (...f: [G, E, D, C, B, A]) => KApp<F, H>, l: (...g: [H, G, E, D, C, B, A]) => KApp<F, I>): (fa: KApp<F, A>) => KApp<F, I>
        <A, B, C, D, E, G, H, I, J>(f: (...a: [A]) => KApp<F, B>, g: (...b: [B, A]) => KApp<F, C>, h: (...c: [C, B, A]) => KApp<F, D>, i: (...d: [D, C, B, A]) => KApp<F, E>, j: (...e: [E, D, C, B, A]) => KApp<F, G>, k: (...f: [G, E, D, C, B, A]) => KApp<F, H>, l: (...g: [H, G, E, D, C, B, A]) => KApp<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => KApp<F, J>): (fa: KApp<F, A>) => KApp<F, J>
        <A, B, C, D, E, G, H, I, J, K>(f: (...a: [A]) => KApp<F, B>, g: (...b: [B, A]) => KApp<F, C>, h: (...c: [C, B, A]) => KApp<F, D>, i: (...d: [D, C, B, A]) => KApp<F, E>, j: (...e: [E, D, C, B, A]) => KApp<F, G>, k: (...f: [G, E, D, C, B, A]) => KApp<F, H>, l: (...g: [H, G, E, D, C, B, A]) => KApp<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => KApp<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => KApp<F, K>): (fa: KApp<F, A>) => KApp<F, K>
        <A, B, C, D, E, G, H, I, J, K, L>(f: (...a: [A]) => KApp<F, B>, g: (...b: [B, A]) => KApp<F, C>, h: (...c: [C, B, A]) => KApp<F, D>, i: (...d: [D, C, B, A]) => KApp<F, E>, j: (...e: [E, D, C, B, A]) => KApp<F, G>, k: (...f: [G, E, D, C, B, A]) => KApp<F, H>, l: (...g: [H, G, E, D, C, B, A]) => KApp<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => KApp<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => KApp<F, K>, o: (...j: [K, J, I, H, G, E, D, C, B, A]) => KApp<F, L>): (fa: KApp<F, A>) => KApp<F, L>
        <A, B, C, D, E, G, H, I, J, K, L, M>(f: (...a: [A]) => KApp<F, B>, g: (...b: [B, A]) => KApp<F, C>, h: (...c: [C, B, A]) => KApp<F, D>, i: (...d: [D, C, B, A]) => KApp<F, E>, j: (...e: [E, D, C, B, A]) => KApp<F, G>, k: (...f: [G, E, D, C, B, A]) => KApp<F, H>, l: (...g: [H, G, E, D, C, B, A]) => KApp<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => KApp<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => KApp<F, K>, o: (...j: [K, J, I, H, G, E, D, C, B, A]) => KApp<F, L>, p: (...k: [L, K, J, I, H, G, E, D, C, B, A]) => KApp<F, M>): (fa: KApp<F, A>) => KApp<F, M>
    }    
    fmap: {
        <A, B>(f: (...a: [A]) => B): (fa: KApp<F, A>) => KApp<F, B>
        <A, B, C>(f: (...a: [A]) => B, g: (...b: [B, A]) => C): (fa: KApp<F, A>) => KApp<F, C>
        <A, B, C, D>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D): (fa: KApp<F, A>) => KApp<F, D>
        <A, B, C, D, E>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E): (fa: KApp<F, A>) => KApp<F, E>
        <A, B, C, D, E, G>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E, j: (...e: [E, D, C, B, A]) => G): (fa: KApp<F, A>) => KApp<F, G>
        <A, B, C, D, E, G, H>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E, j: (...e: [E, D, C, B, A]) => G, k: (...f: [G, E, D, C, B, A]) => H): (fa: KApp<F, A>) => KApp<F, H>
        <A, B, C, D, E, G, H, I>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E, j: (...e: [E, D, C, B, A]) => G, k: (...f: [G, E, D, C, B, A]) => H, l: (...g: [H, G, E, D, C, B, A]) => I): (fa: KApp<F, A>) => KApp<F, I>
        <A, B, C, D, E, G, H, I, J>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E, j: (...e: [E, D, C, B, A]) => G, k: (...f: [G, E, D, C, B, A]) => H, l: (...g: [H, G, E, D, C, B, A]) => I, m: (...h: [I, H, G, E, D, C, B, A]) => J): (fa: KApp<F, A>) => KApp<F, J>
        <A, B, C, D, E, G, H, I, J, K>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E, j: (...e: [E, D, C, B, A]) => G, k: (...f: [G, E, D, C, B, A]) => H, l: (...g: [H, G, E, D, C, B, A]) => I, m: (...h: [I, H, G, E, D, C, B, A]) => J, n: (...i: [J, I, H, G, E, D, C, B, A]) => K): (fa: KApp<F, A>) => KApp<F, K>
        <A, B, C, D, E, G, H, I, J, K, L>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E, j: (...e: [E, D, C, B, A]) => G, k: (...f: [G, E, D, C, B, A]) => H, l: (...g: [H, G, E, D, C, B, A]) => I, m: (...h: [I, H, G, E, D, C, B, A]) => J, n: (...i: [J, I, H, G, E, D, C, B, A]) => K, o: (...j: [K, J, I, H, G, E, D, C, B, A]) => L): (fa: KApp<F, A>) => KApp<F, L>
        <A, B, C, D, E, G, H, I, J, K, L, M>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E, j: (...e: [E, D, C, B, A]) => G, k: (...f: [G, E, D, C, B, A]) => H, l: (...g: [H, G, E, D, C, B, A]) => I, m: (...h: [I, H, G, E, D, C, B, A]) => J, n: (...i: [J, I, H, G, E, D, C, B, A]) => K, o: (...j: [K, J, I, H, G, E, D, C, B, A]) => L, p: (...k: [L, K, J, I, H, G, E, D, C, B, A]) => M): (fa: KApp<F, A>) => KApp<F, M>
    }
}

export function monad<F extends KType>(base: IMonadBase<F>): IMonad<F> {
    const map = <A, B>(fa: KApp<F, A>, f: (a: A) => B): KApp<F, B> => base.bind(fa, a => base.unit(f(a)));
    const join = <A>(ffa: KApp<F, KApp<F, A>>): KApp<F, A> => base.bind(ffa, fa => fa);

    const chain = (...fs: ((...s: any[]) => KApp<F, any>)[]) =>
        (m: KApp<F, any>) => pipe(m, ...fs);

    const sequence = <A>(fas: KApp<F, A>[]): KApp<F, A[]> => 
        fas.reduceRight((acc, fa) => base.bind(fa, a => map(acc, as => [a, ...as])), base.unit([] as A[]));

    const fmap = (...fs: ((...s: any[]) => any)[]) =>
        chain(...fs.map(f => (...args: any[]) => base.unit(f(...args))));

    const pipe = (head: KApp<F, any>, ...tail: ((...s: any[]) => KApp<F, any>)[]) => 
        base.bind(head, tail.reduceRight((acc, f) => (...arg) => base.bind(f(...arg), a => acc(...[a, ...arg])), base.unit));
   
    return { ...base, map, join, chain, sequence, pipe, fmap };
}

// bind(A, a => bind(f(a), b => bind(g(b), c => unit(c))))
 