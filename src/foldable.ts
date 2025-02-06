// import { fix, Fix, IFix } from "./fix.js";
// import { $, KRoot } from "./hkt.js";
// import { maybe, Maybe } from "./maybe.js";
// import { IMonad } from "./monad.js";
// import { IMonoid } from "./monoid.js";
// import { tuple } from "./tuple.js";
// import { chain, pipe } from "./utils.js";

// export interface KFoldable<P> extends KRoot {
//     readonly 0: unknown;
//     readonly 1: unknown;
//     readonly body: $<P, Maybe<[this[0], this[1]]>>;
// }

// export interface IFoldableBase<F, P> {
//     readonly fixRoot: IMonad<P>
//     fixValue<A>(fa: $<F, A>): Fix<$<KFoldable<P>, A>>
//     unfixValue<A>(fx: Fix<$<KFoldable<P>, A>>): $<F, A>
// }

// export type FoldFix<P, A> = Fix<$<KFoldable<P>, A>>

// export interface IFoldable<F, P> extends IFoldableBase<F, P> {
//     fixFunctor<A>(): IFix<$<KFoldable<P>, A>>
//     foldl<A, B>(f: (b: B, a: A) => B): (b: B) => (fa: $<F, A>) => $<P, B>
//     foldr<A, B>(f: (a: A, b: B) => B): (b: B) => (fa: $<F, A>) => $<P, B>
//     unfold<A, B>(alg: (b: B) => $<P, Maybe<[A, B]>>): (b: B) => $<F, A>
//     foldMap<M>(m: IMonoid<M>): <A, B>(f: (a: A) => $<M, B>) => (fa: $<F, A>) => $<P, $<M, B>>
//     fold<M>(m: IMonoid<M>): <A>(fa: $<F, $<M, A>>) => $<P, $<M, A>>
//     toArray<A>(fa: $<F, A>): $<P, A[]>
//     sum(fa: $<F, number>): $<P, number>
//     avg(fa: $<F, number>): $<P, number>
//     first<A>(fa: $<F, A>): $<P, Maybe<A>>
//     empty<A>(): FoldFix<P, A>
//     cons<A>(h: A, t: FoldFix<P, A>): FoldFix<P, A>
//     read<A, B>(fa: FoldFix<P, A>, yes: (h: A, t: FoldFix<P, A>) => $<P, B>, no: () => $<P, B>): $<P, B>
//     append<A>(l: FoldFix<P, A>, r: FoldFix<P, A>): $<P, FoldFix<P, A>>
//     unit<A>(a: A): $<P, FoldFix<P, A>>
//     bind<A, B>(pl: $<P, FoldFix<P, A>>, f: (a: A) => $<P, FoldFix<P, B>>): $<P, FoldFix<P, B>>
// }

// export function fold<F, P>(base: IFoldableBase<F, P>): IFoldable<F, P> {
//     type I = IFoldable<F, P>;

//     const mtFunctor = <A>() => maybe.compose(tuple.of<A>());

//     return pipe(
//         base,
//         base => {
//             const fixFunctor = <A>() => fix<$<KFoldable<P>, A>>({
//                 map: base.fixRoot.compose(mtFunctor<A>()).map
//             });
        
//             const foldl = <A, B>(f: (b: B, a: A) => B) => (b: B) => (fa: $<F, A>) => {
//                 const go = (zero: B, pa: Fix<$<KFoldable<P>, A>>): $<P, B> => base.fixRoot.bind(pa.unfix, maybePair => {
//                     if (maybePair.right) {
//                         const [a, fx] = maybePair.value;
//                         return go(f(zero, a), fx);
//                     } else {
//                         return base.fixRoot.unit(zero);
//                     }
//                 });        
        
//                 return go(b, base.fixValue(fa));
//             }

//             const foldr = <A, B>(f: (a: A, b: B) => B) => (b: B) => (fa: $<F, A>) => {
//                 const go = (zero: B) => fixFunctor<A>().foldFix((fa: $<P, Maybe<[A, $<P, B>]>>) => 
//                     base.fixRoot.bind(fa, maybePair => {
//                         if (maybePair.right) {
//                             const [a, pb] = maybePair.value;
//                             return base.fixRoot.map(pb, b => f(a, b));
//                         } else {
//                             return base.fixRoot.unit(zero);
//                         }
//                     })
//                 );      
        
//                 return go(b)(base.fixValue(fa));
//             }
            
//             const unfold = <A, B>(alg: (b: B) => $<P, Maybe<[A, B]>>) => (b: B): $<F, A> => {
//                 return base.unfixValue(fixFunctor<A>().unfoldFix(alg)(b));
//             }

//             return {
//                 fixFunctor,
//                 foldl,
//                 foldr,
//                 unfold,
//                 ...base
//             }
//         },
//         base => {        
//             const _foldl = <A, B>(f: (b: B, a: A) => B, b: B, fa: $<F, A>) => base.foldl<A, B>(f)(b)(fa);        
//             const foldMap: I['foldMap'] = m => f => fa => _foldl((mb, a) => m.append(mb, f(a)), m.empty(), fa);
//             const fold: I['fold'] = m => fa => _foldl((mb, a) => m.append(mb, a), m.empty(), fa);
//             const toArray: I['toArray'] = <A>(fa: $<F, A>) => _foldl((acc: A[], a) => [...acc, a], [], fa);
//             const sum: I['sum'] = fa => _foldl((acc, a) => acc + a, 0, fa);
//             const first = <A>(fa: $<F, A>) => base.fixRoot.map(base.fixValue(fa).unfix, maybe.fmap(([a, _]) => a));
        
//             const avg: I['avg'] = chain(
//                 base.foldl<number, [number, number]>(([sum, count], n) => [sum + n, count + 1])([0, 0]),
//                 base.fixRoot.fmap(([sum, count]) => sum / count)
//             );

//             const fr = base.fixRoot;

//             const empty = <A>(): FoldFix<P, A> => ({ unfix: fr.unit(maybe.nothing as Maybe<[A, FoldFix<P, A>]>) });

//             const cons = <A>(h: A, t: FoldFix<P, A>): FoldFix<P, A> => ({
//                 unfix: fr.unit(maybe.just([h, t]) as Maybe<[A, FoldFix<P, A>]>)
//             });

//             const read = <A, B>(fa: FoldFix<P, A>, yes: (h: A, t: FoldFix<P, A>) => $<P, B>, no: () => $<P, B>): $<P, B> => {
//                 return fr.bind(fa.unfix, mt => mt.right ? yes(mt.value[0], mt.value[1]) : no());
//             }

//             const append = <A>(l: FoldFix<P, A>, r: FoldFix<P, A>): $<P, FoldFix<P, A>> => {
//                 return read(l, (h, t) => fr.map(append(t, r), tr => cons(h, tr)), () => fr.unit(r));
//             }

//             const unit = <A>(a: A): $<P, FoldFix<P, A>> => fr.unit(cons(a, empty<A>()));

//             const bind = <A, B>(pl: $<P, FoldFix<P, A>>, f: (a: A) => $<P, FoldFix<P, B>>): $<P, FoldFix<P, B>> => {
//                 return fr.bind(pl, l => {
//                     return read(l, (h, t) => {
//                         const fh = f(h);
//                         const ft = bind(fr.unit(t), f);
//                         return fr.bind(fh, ffpb1 => fr.bind(ft, ffpb2 => append(ffpb1, ffpb2)));
//                     }, () => fr.unit(empty<B>()));
//                 });
//             }

//             return {
//                 foldMap,
//                 fold,
//                 toArray,
//                 sum,
//                 avg,
//                 first,
//                 empty,
//                 cons,
//                 read,
//                 append,
//                 unit,
//                 bind,
//                 ...base
//             }
//         }
//     )
// }
