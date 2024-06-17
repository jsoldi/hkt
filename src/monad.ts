import { HKT, Kind } from "./hkt.js";

export interface IMonadBase<F extends HKT> {
    unit<A>(a: A): Kind<F, A>
    bind<A, B>(fa: Kind<F, A>, f: (a: A) => Kind<F, B>): Kind<F, B>
}

export interface IMonad<F extends HKT> extends IMonadBase<F> {
    map<A, B>(fa: Kind<F, A>, f: (a: A) => B): Kind<F, B>
    join<A>(ffa: Kind<F, Kind<F, A>>): Kind<F, A>
    lift<A, B>(f: (a: A) => B): (fa: Kind<F, A>) => Kind<F, B>
    sequence<A>(fas: Kind<F, A>[]): Kind<F, A[]>
    pipe: {
        <A>(a: Kind<F, A>): Kind<F, A>
        <A, B>(a: Kind<F, A>, b:(...a: [A]) => Kind<F, B>): Kind<F, B>
        <A, B, C>(a: Kind<F, A>, b:(...a: [A]) => Kind<F, B>, c:(...a: [B, A]) => Kind<F, C>): Kind<F, C>
        <A, B, C, D>(a: Kind<F, A>, b:(...a: [A]) => Kind<F, B>, c:(...a: [B, A]) => Kind<F, C>, d:(...a: [C, B, A]) => Kind<F, D>): Kind<F, D>
        <A, B, C, D, E>(a: Kind<F, A>, b:(...a: [A]) => Kind<F, B>, c:(...a: [B, A]) => Kind<F, C>, d:(...a: [C, B, A]) => Kind<F, D>, e:(...a: [D, C, B, A]) => Kind<F, E>): Kind<F, E>
        <A, B, C, D, E, G>(a: Kind<F, A>, b:(...a: [A]) => Kind<F, B>, c:(...a: [B, A]) => Kind<F, C>, d:(...a: [C, B, A]) => Kind<F, D>, e:(...a: [D, C, B, A]) => Kind<F, E>, f:(...a: [E, D, C, B, A]) => Kind<F, G>): Kind<F, G>
        <A, B, C, D, E, G, H>(a: Kind<F, A>, b:(...a: [A]) => Kind<F, B>, c:(...a: [B, A]) => Kind<F, C>, d:(...a: [C, B, A]) => Kind<F, D>, e:(...a: [D, C, B, A]) => Kind<F, E>, f:(...a: [E, D, C, B, A]) => Kind<F, G>, g:(...a: [G, E, D, C, B, A]) => Kind<F, H>): Kind<F, H>
        <A, B, C, D, E, G, H, I>(a: Kind<F, A>, b:(...a: [A]) => Kind<F, B>, c:(...a: [B, A]) => Kind<F, C>, d:(...a: [C, B, A]) => Kind<F, D>, e:(...a: [D, C, B, A]) => Kind<F, E>, f:(...a: [E, D, C, B, A]) => Kind<F, G>, g:(...a: [G, E, D, C, B, A]) => Kind<F, H>, h:(...a: [H, G, E, D, C, B, A]) => Kind<F, I>): Kind<F, I>
        <A, B, C, D, E, G, H, I, J>(a: Kind<F, A>, b:(...a: [A]) => Kind<F, B>, c:(...a: [B, A]) => Kind<F, C>, d:(...a: [C, B, A]) => Kind<F, D>, e:(...a: [D, C, B, A]) => Kind<F, E>, f:(...a: [E, D, C, B, A]) => Kind<F, G>, g:(...a: [G, E, D, C, B, A]) => Kind<F, H>, h:(...a: [H, G, E, D, C, B, A]) => Kind<F, I>, i:(...a: [I, H, G, E, D, C, B, A]) => Kind<F, J>): Kind<F, J>
        <A, B, C, D, E, G, H, I, J, K>(a: Kind<F, A>, b:(...a: [A]) => Kind<F, B>, c:(...a: [B, A]) => Kind<F, C>, d:(...a: [C, B, A]) => Kind<F, D>, e:(...a: [D, C, B, A]) => Kind<F, E>, f:(...a: [E, D, C, B, A]) => Kind<F, G>, g:(...a: [G, E, D, C, B, A]) => Kind<F, H>, h:(...a: [H, G, E, D, C, B, A]) => Kind<F, I>, i:(...a: [I, H, G, E, D, C, B, A]) => Kind<F, J>, j:(...a: [J, I, H, G, E, D, C, B, A]) => Kind<F, K>): Kind<F, K>
        <A, B, C, D, E, G, H, I, J, K, L>(a: Kind<F, A>, b:(...a: [A]) => Kind<F, B>, c:(...a: [B, A]) => Kind<F, C>, d:(...a: [C, B, A]) => Kind<F, D>, e:(...a: [D, C, B, A]) => Kind<F, E>, f:(...a: [E, D, C, B, A]) => Kind<F, G>, g:(...a: [G, E, D, C, B, A]) => Kind<F, H>, h:(...a: [H, G, E, D, C, B, A]) => Kind<F, I>, i:(...a: [I, H, G, E, D, C, B, A]) => Kind<F, J>, j:(...a: [J, I, H, G, E, D, C, B, A]) => Kind<F, K>, k:(...a: [K, J, I, H, G, E, D, C, B, A]) => Kind<F, L>): Kind<F, L>
        <A, B, C, D, E, G, H, I, J, K, L, M>(a: Kind<F, A>, b:(...a: [A]) => Kind<F, B>, c:(...a: [B, A]) => Kind<F, C>, d:(...a: [C, B, A]) => Kind<F, D>, e:(...a: [D, C, B, A]) => Kind<F, E>, f:(...a: [E, D, C, B, A]) => Kind<F, G>, g:(...a: [G, E, D, C, B, A]) => Kind<F, H>, h:(...a: [H, G, E, D, C, B, A]) => Kind<F, I>, i:(...a: [I, H, G, E, D, C, B, A]) => Kind<F, J>, j:(...a: [J, I, H, G, E, D, C, B, A]) => Kind<F, K>, k:(...a: [K, J, I, H, G, E, D, C, B, A]) => Kind<F, L>, l:(...a: [L, K, J, I, H, G, E, D, C, B, A]) => Kind<F, M>): Kind<F, M>
    }
    chain: {
        <A, B>(f: (...a: [A]) => Kind<F, B>): (fa: Kind<F, A>) => Kind<F, B>
        <A, B, C>(f: (...a: [A]) => Kind<F, B>, g: (...b: [B, A]) => Kind<F, C>): (fa: Kind<F, A>) => Kind<F, C>
        <A, B, C, D>(f: (...a: [A]) => Kind<F, B>, g: (...b: [B, A]) => Kind<F, C>, h: (...c: [C, B, A]) => Kind<F, D>): (fa: Kind<F, A>) => Kind<F, D>
        <A, B, C, D, E>(f: (...a: [A]) => Kind<F, B>, g: (...b: [B, A]) => Kind<F, C>, h: (...c: [C, B, A]) => Kind<F, D>, i: (...d: [D, C, B, A]) => Kind<F, E>): (fa: Kind<F, A>) => Kind<F, E>
        <A, B, C, D, E, G>(f: (...a: [A]) => Kind<F, B>, g: (...b: [B, A]) => Kind<F, C>, h: (...c: [C, B, A]) => Kind<F, D>, i: (...d: [D, C, B, A]) => Kind<F, E>, j: (...e: [E, D, C, B, A]) => Kind<F, G>): (fa: Kind<F, A>) => Kind<F, G>
        <A, B, C, D, E, G, H>(f: (...a: [A]) => Kind<F, B>, g: (...b: [B, A]) => Kind<F, C>, h: (...c: [C, B, A]) => Kind<F, D>, i: (...d: [D, C, B, A]) => Kind<F, E>, j: (...e: [E, D, C, B, A]) => Kind<F, G>, k: (...f: [G, E, D, C, B, A]) => Kind<F, H>): (fa: Kind<F, A>) => Kind<F, H>
        <A, B, C, D, E, G, H, I>(f: (...a: [A]) => Kind<F, B>, g: (...b: [B, A]) => Kind<F, C>, h: (...c: [C, B, A]) => Kind<F, D>, i: (...d: [D, C, B, A]) => Kind<F, E>, j: (...e: [E, D, C, B, A]) => Kind<F, G>, k: (...f: [G, E, D, C, B, A]) => Kind<F, H>, l: (...g: [H, G, E, D, C, B, A]) => Kind<F, I>): (fa: Kind<F, A>) => Kind<F, I>
        <A, B, C, D, E, G, H, I, J>(f: (...a: [A]) => Kind<F, B>, g: (...b: [B, A]) => Kind<F, C>, h: (...c: [C, B, A]) => Kind<F, D>, i: (...d: [D, C, B, A]) => Kind<F, E>, j: (...e: [E, D, C, B, A]) => Kind<F, G>, k: (...f: [G, E, D, C, B, A]) => Kind<F, H>, l: (...g: [H, G, E, D, C, B, A]) => Kind<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => Kind<F, J>): (fa: Kind<F, A>) => Kind<F, J>
        <A, B, C, D, E, G, H, I, J, K>(f: (...a: [A]) => Kind<F, B>, g: (...b: [B, A]) => Kind<F, C>, h: (...c: [C, B, A]) => Kind<F, D>, i: (...d: [D, C, B, A]) => Kind<F, E>, j: (...e: [E, D, C, B, A]) => Kind<F, G>, k: (...f: [G, E, D, C, B, A]) => Kind<F, H>, l: (...g: [H, G, E, D, C, B, A]) => Kind<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => Kind<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => Kind<F, K>): (fa: Kind<F, A>) => Kind<F, K>
        <A, B, C, D, E, G, H, I, J, K, L>(f: (...a: [A]) => Kind<F, B>, g: (...b: [B, A]) => Kind<F, C>, h: (...c: [C, B, A]) => Kind<F, D>, i: (...d: [D, C, B, A]) => Kind<F, E>, j: (...e: [E, D, C, B, A]) => Kind<F, G>, k: (...f: [G, E, D, C, B, A]) => Kind<F, H>, l: (...g: [H, G, E, D, C, B, A]) => Kind<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => Kind<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => Kind<F, K>, o: (...j: [K, J, I, H, G, E, D, C, B, A]) => Kind<F, L>): (fa: Kind<F, A>) => Kind<F, L>
        <A, B, C, D, E, G, H, I, J, K, L, M>(f: (...a: [A]) => Kind<F, B>, g: (...b: [B, A]) => Kind<F, C>, h: (...c: [C, B, A]) => Kind<F, D>, i: (...d: [D, C, B, A]) => Kind<F, E>, j: (...e: [E, D, C, B, A]) => Kind<F, G>, k: (...f: [G, E, D, C, B, A]) => Kind<F, H>, l: (...g: [H, G, E, D, C, B, A]) => Kind<F, I>, m: (...h: [I, H, G, E, D, C, B, A]) => Kind<F, J>, n: (...i: [J, I, H, G, E, D, C, B, A]) => Kind<F, K>, o: (...j: [K, J, I, H, G, E, D, C, B, A]) => Kind<F, L>, p: (...k: [L, K, J, I, H, G, E, D, C, B, A]) => Kind<F, M>): (fa: Kind<F, A>) => Kind<F, M>
    }
}

export function monad<F extends HKT>(base: IMonadBase<F>): IMonad<F> {
    const map = <A, B>(fa: Kind<F, A>, f: (a: A) => B): Kind<F, B> => base.bind(fa, a => base.unit(f(a)));
    const join = <A>(ffa: Kind<F, Kind<F, A>>): Kind<F, A> => base.bind(ffa, fa => fa);
    const lift = <A, B>(f: (a: A) => B) => (fa: Kind<F, A>): Kind<F, B> => map(fa, f);

    const chain = (...fs: ((...s: any[]) => Kind<F, any>)[]) =>
        fs.reduceRight((acc, f) => (...args) => base.bind(f(...args), a => acc(...[a, ...args])));

    const sequence = <A>(fas: Kind<F, A>[]): Kind<F, A[]> => 
        fas.reduceRight((acc, fa) => base.bind(fa, a => map(acc, as => [a, ...as])), base.unit([] as A[]));
    
    const pipe = (head: Kind<F, any>, ...tail: ((...s: any[]) => Kind<F, any>)[]) => chain(...[() => head, ...tail])();
    
    return { ...base, map, join, lift, chain, sequence, pipe };
}
