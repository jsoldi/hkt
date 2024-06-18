import { KApp2, KType } from "./hkt.js";

export interface IMonadBase<F> {
    unit<A>(a: A): KApp2<F, A>
    bind<A, B>(fa: KApp2<F, A>, f: (a: A) => KApp2<F, B>): KApp2<F, B>
}

export interface IMonad<F> extends IMonadBase<F> {
    map<A, B>(fa: KApp2<F, A>, f: (a: A) => B): KApp2<F, B>
    join<A>(ffa: KApp2<F, KApp2<F, A>>): KApp2<F, A>
    sequence<A>(fas: KApp2<F, A>[]): KApp2<F, A[]>
    pipe: {
        <A>(a: KApp2<F, A>): KApp2<F, A>
        <A, B>(a: KApp2<F, A>, b:(...a: [A]) => KApp2<F, B>): KApp2<F, B>
        <A, B, C>(a: KApp2<F, A>, b:(...a: [A]) => KApp2<F, B>, c:(...a: [B, A]) => KApp2<F, C>): KApp2<F, C>
        <A, B, C, D>(a: KApp2<F, A>, b:(...a: [A]) => KApp2<F, B>, c:(...a: [B, A]) => KApp2<F, C>, d:(...a: [C, B, A]) => KApp2<F, D>): KApp2<F, D>
        <A, B, C, D, E>(a: KApp2<F, A>, b:(...a: [A]) => KApp2<F, B>, c:(...a: [B, A]) => KApp2<F, C>, d:(...a: [C, B, A]) => KApp2<F, D>, e:(...a: [D, C, B, A]) => KApp2<F, E>): KApp2<F, E>
        <A, B, C, D, E, G>(a: KApp2<F, A>, b:(...a: [A]) => KApp2<F, B>, c:(...a: [B, A]) => KApp2<F, C>, d:(...a: [C, B, A]) => KApp2<F, D>, e:(...a: [D, C, B, A]) => KApp2<F, E>, f:(...a: [E, D, C, B, A]) => KApp2<F, G>): KApp2<F, G>
        <A, B, C, D, E, G, H>(a: KApp2<F, A>, b:(...a: [A]) => KApp2<F, B>, c:(...a: [B, A]) => KApp2<F, C>, d:(...a: [C, B, A]) => KApp2<F, D>, e:(...a: [D, C, B, A]) => KApp2<F, E>, f:(...a: [E, D, C, B, A]) => KApp2<F, G>, g:(...a: [G, E, D, C, B, A]) => KApp2<F, H>): KApp2<F, H>
        <A, B, C, D, E, G, H, I>(a: KApp2<F, A>, b:(...a: [A]) => KApp2<F, B>, c:(...a: [B, A]) => KApp2<F, C>, d:(...a: [C, B, A]) => KApp2<F, D>, e:(...a: [D, C, B, A]) => KApp2<F, E>, f:(...a: [E, D, C, B, A]) => KApp2<F, G>, g:(...a: [G, E, D, C, B, A]) => KApp2<F, H>, h:(...a: [H, G, E, D, C, B, A]) => KApp2<F, I>): KApp2<F, I>
        <A, B, C, D, E, G, H, I, J>(a: KApp2<F, A>, b:(...a: [A]) => KApp2<F, B>, c:(...a: [B, A]) => KApp2<F, C>, d:(...a: [C, B, A]) => KApp2<F, D>, e:(...a: [D, C, B, A]) => KApp2<F, E>, f:(...a: [E, D, C, B, A]) => KApp2<F, G>, g:(...a: [G, E, D, C, B, A]) => KApp2<F, H>, h:(...a: [H, G, E, D, C, B, A]) => KApp2<F, I>, i:(...a: [I, H, G, E, D, C, B, A]) => KApp2<F, J>): KApp2<F, J>
        <A, B, C, D, E, G, H, I, J, K>(a: KApp2<F, A>, b:(...a: [A]) => KApp2<F, B>, c:(...a: [B, A]) => KApp2<F, C>, d:(...a: [C, B, A]) => KApp2<F, D>, e:(...a: [D, C, B, A]) => KApp2<F, E>, f:(...a: [E, D, C, B, A]) => KApp2<F, G>, g:(...a: [G, E, D, C, B, A]) => KApp2<F, H>, h:(...a: [H, G, E, D, C, B, A]) => KApp2<F, I>, i:(...a: [I, H, G, E, D, C, B, A]) => KApp2<F, J>, j:(...a: [J, I, H, G, E, D, C, B, A]) => KApp2<F, K>): KApp2<F, K>
        <A, B, C, D, E, G, H, I, J, K, L>(a: KApp2<F, A>, b:(...a: [A]) => KApp2<F, B>, c:(...a: [B, A]) => KApp2<F, C>, d:(...a: [C, B, A]) => KApp2<F, D>, e:(...a: [D, C, B, A]) => KApp2<F, E>, f:(...a: [E, D, C, B, A]) => KApp2<F, G>, g:(...a: [G, E, D, C, B, A]) => KApp2<F, H>, h:(...a: [H, G, E, D, C, B, A]) => KApp2<F, I>, i:(...a: [I, H, G, E, D, C, B, A]) => KApp2<F, J>, j:(...a: [J, I, H, G, E, D, C, B, A]) => KApp2<F, K>, k:(...a: [K, J, I, H, G, E, D, C, B, A]) => KApp2<F, L>): KApp2<F, L>
        <A, B, C, D, E, G, H, I, J, K, L, M>(a: KApp2<F, A>, b:(...a: [A]) => KApp2<F, B>, c:(...a: [B, A]) => KApp2<F, C>, d:(...a: [C, B, A]) => KApp2<F, D>, e:(...a: [D, C, B, A]) => KApp2<F, E>, f:(...a: [E, D, C, B, A]) => KApp2<F, G>, g:(...a: [G, E, D, C, B, A]) => KApp2<F, H>, h:(...a: [H, G, E, D, C, B, A]) => KApp2<F, I>, i:(...a: [I, H, G, E, D, C, B, A]) => KApp2<F, J>, j:(...a: [J, I, H, G, E, D, C, B, A]) => KApp2<F, K>, k:(...a: [K, J, I, H, G, E, D, C, B, A]) => KApp2<F, L>, l:(...a: [L, K, J, I, H, G, E, D, C, B, A]) => KApp2<F, M>): KApp2<F, M>
    }
    chain: {
        <A, B>(f: (...a: [A]) => KApp2<F, B>): (fa: KApp2<F, A>) => KApp2<F, B>
        <A, B, C>(f: (...a: [A]) => KApp2<F, B>, g: (...b: [B, A]) => KApp2<F, C>): (fa: KApp2<F, A>) => KApp2<F, C>
        <A, B, C, D>(f: (...a: [A]) => KApp2<F, B>, g: (...b: [B, A]) => KApp2<F, C>, h: (...c: [C, B, A]) => KApp2<F, D>): (fa: KApp2<F, A>) => KApp2<F, D>
        <A, B, C, D, E>(f: (...a: [A]) => KApp2<F, B>, g: (...b: [B, A]) => KApp2<F, C>, h: (...c: [C, B, A]) => KApp2<F, D>, i: (...d: [D, C, B, A]) => KApp2<F, E>): (fa: KApp2<F, A>) => KApp2<F, E>
        <A, B, C, D, E, G>(f: (...a: [A]) => KApp2<F, B>, g: (...b: [B, A]) => KApp2<F, C>, h: (...c: [C, B, A]) => KApp2<F, D>, i: (...d: [D, C, B, A]) => KApp2<F, E>, j: (...e: [E, D, C, B, A]) => KApp2<F, G>): (fa: KApp2<F, A>) => KApp2<F, G>
        <A, B, C, D, E, G, H>(f: (...a: [A]) => KApp2<F, B>, g: (...b: [B, A]) => KApp2<F, C>, h: (...c: [C, B, A]) => KApp2<F, D>, i: (...d: [D, C, B, A]) => KApp2<F, E>, j: (...e: [E, D, C, B, A]) => KApp2<F, G>, k: (...f: [G, E, D, C, B, A]) => KApp2<F, H>): (fa: KApp2<F, A>) => KApp2<F, H>
        <A, B, C, D, E, G, H, I>(f: (...a: [A]) => KApp2<F, B>, g: (...b: [B, A]) => KApp2<F, C>, h: (...c: [C, B, A]) => KApp2<F, D>, i: (...d: [D, C, B, A]) => KApp2<F, E>, j: (...e: [E, D, C, B, A]) => KApp2<F, G>, k: (...f: [G, E, D, C, B, A]) => KApp2<F, H>, l: (...g: [H, G, E, D, C, B, A]) => KApp2<F, I>): (fa: KApp2<F, A>) => KApp2<F, I>
        <A, B, C, D, E, G, H, I, J>(f: (...a: [A]) => KApp2<F, B>, g: (...b: [B, A]) => KApp2<F, C>, h: (...c: [C, B, A]) => KApp2<F, D>, i: (...d: [D, C, B, A]) => KApp2<F, E>, j: (...e: [E, D, C, B, A]) => KApp2<F, G>, k: (...f: [G, E, D, C, B, A]) => KApp2<F, H>, l: (...g: [H, G, E, D, C, B, A]) => KApp2<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => KApp2<F, J>): (fa: KApp2<F, A>) => KApp2<F, J>
        <A, B, C, D, E, G, H, I, J, K>(f: (...a: [A]) => KApp2<F, B>, g: (...b: [B, A]) => KApp2<F, C>, h: (...c: [C, B, A]) => KApp2<F, D>, i: (...d: [D, C, B, A]) => KApp2<F, E>, j: (...e: [E, D, C, B, A]) => KApp2<F, G>, k: (...f: [G, E, D, C, B, A]) => KApp2<F, H>, l: (...g: [H, G, E, D, C, B, A]) => KApp2<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => KApp2<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => KApp2<F, K>): (fa: KApp2<F, A>) => KApp2<F, K>
        <A, B, C, D, E, G, H, I, J, K, L>(f: (...a: [A]) => KApp2<F, B>, g: (...b: [B, A]) => KApp2<F, C>, h: (...c: [C, B, A]) => KApp2<F, D>, i: (...d: [D, C, B, A]) => KApp2<F, E>, j: (...e: [E, D, C, B, A]) => KApp2<F, G>, k: (...f: [G, E, D, C, B, A]) => KApp2<F, H>, l: (...g: [H, G, E, D, C, B, A]) => KApp2<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => KApp2<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => KApp2<F, K>, o: (...j: [K, J, I, H, G, E, D, C, B, A]) => KApp2<F, L>): (fa: KApp2<F, A>) => KApp2<F, L>
        <A, B, C, D, E, G, H, I, J, K, L, M>(f: (...a: [A]) => KApp2<F, B>, g: (...b: [B, A]) => KApp2<F, C>, h: (...c: [C, B, A]) => KApp2<F, D>, i: (...d: [D, C, B, A]) => KApp2<F, E>, j: (...e: [E, D, C, B, A]) => KApp2<F, G>, k: (...f: [G, E, D, C, B, A]) => KApp2<F, H>, l: (...g: [H, G, E, D, C, B, A]) => KApp2<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => KApp2<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => KApp2<F, K>, o: (...j: [K, J, I, H, G, E, D, C, B, A]) => KApp2<F, L>, p: (...k: [L, K, J, I, H, G, E, D, C, B, A]) => KApp2<F, M>): (fa: KApp2<F, A>) => KApp2<F, M>
    }    
}

export function monad<F extends KType>(base: IMonadBase<F>): IMonad<F> {
    const map = <A, B>(fa: KApp2<F, A>, f: (a: A) => B): KApp2<F, B> => base.bind(fa, a => base.unit(f(a)));
    const join = <A>(ffa: KApp2<F, KApp2<F, A>>): KApp2<F, A> => base.bind(ffa, fa => fa);

    const chain = (...fs: ((...s: any[]) => KApp2<F, any>)[]) =>
        fs.reduceRight((acc, f) => (...args) => base.bind(f(...args), a => acc(...[a, ...args])));

    const sequence = <A>(fas: KApp2<F, A>[]): KApp2<F, A[]> => 
        fas.reduceRight((acc, fa) => base.bind(fa, a => map(acc, as => [a, ...as])), base.unit([] as A[]));

    const pipe = (head: KApp2<F, any>, ...tail: ((...s: any[]) => KApp2<F, any>)[]) => chain(...[() => head, ...tail])();
   
    return { ...base, map, join, chain, sequence, pipe };
}
