import { applicative, IApplicative } from "./applicative.js";
import { functor } from "./functor.js";
import { $, $I } from "../core/hkt.js";
import { ITransformer, monadTrans } from "./transformer.js";
import { TypeClassArg } from "./utilities.js";
import { id } from "../core/utils.js";
import { pipe as _pipe } from "../core/utils.js";
import { Free } from "../types/free/functorFree.js";

export interface IMonadBase<F> {
    unit<A>(a: A): $<F, A>
    bind<A, B>(fa: $<F, A>, f: (a: A) => $<F, B>): $<F, B>
}

export interface IMonad<F> extends IMonadBase<F>, IApplicative<F> {
    flatMap<A, B>(f: (a: A) => $<F, B>): (fa: $<F, A>) => $<F, B>
    runFree<A>(t: Free<A, F>): $<F, A>
    flat<A>(ffa: $<F, $<F, A>>): $<F, A>
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
    fish(...b: ((...a: any[]) => $<F, any>)[]): (...s: any[]) => $<F, any>
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
    pipe(a: $<F, any>, ...b: ((...a: any[]) => $<F, any>)[]): $<F, any>
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
    chain(...b: ((...a: any[]) => $<F, any>)[]): (fa: $<F, any>) => $<F, any>
}

const is_monad = Symbol("is_monad");

export type MonadArg<F> = TypeClassArg<IMonadBase<F>, IMonad<F>, typeof is_monad>;

export function _monad<F>(base: MonadArg<F>): IMonad<F> {
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
        base => ({
            ...applicative<F>({
                apply: fab => fa => base.bind(fab, f => base.map(fa, f)),
                ...base
            }),
            ...base
        }),
        base => {
            const flatMap = <A, B>(f: (a: A) => $<F, B>) => (fa: $<F, A>) => base.bind(fa, f);
            const flat = <A>(ffa: $<F, $<F, A>>): $<F, A> => base.bind(ffa, id);
        
            const _kleisli = (...fs: ((...s: any[]) => $<F, any>)[]) => 
                fs.reduceRight((acc, f) => (...arg) => base.bind(f(...arg), a => acc(...[a, ...arg])), base.unit);
 
            const _pipe = (head: $<F, any>, ...tail: ((...s: any[]) => $<F, any>)[]) => 
                base.bind(head, _kleisli(...tail));

            const _chain = (...fs: ((...s: any[]) => $<F, any>)[]) => flatMap(_kleisli(...fs));

            const runFree = <A>(t: Free<A, F>): $<F, A> => {
                if(t.right) {
                    return base.bind(t.value, runFree);
                } else {
                    return base.unit(t.value);
                }
            }

            return {
                [is_monad]: true,
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

export type ITrivial = IMonad<$I> & ITransformer<$I>;

export interface IMonadFactory {
    <F>(base: MonadArg<F>): IMonad<F>;
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

export const monad: IMonadFactory = _monad;
