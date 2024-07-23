import { KApp, KRoot } from "./hkt.js";
import { IMonad, monad } from "./monad.js";

export interface ITransform<F, T> extends IMonad<KApp<T, F>> {
    readonly lift: <A>(a: KApp<F, A>) => KApp<KApp<T, F>, A>
}

export interface ITransMonad<F, T = KTransform<F>> extends IMonad<F> {
    readonly transform: <K>(outer: IMonad<K>) => ITransform<K, T>
}

export interface KTransform<K> extends KRoot {
    readonly 0: unknown
    readonly 1: unknown
    readonly body: KApp<this[0], KApp<K, this[1]>>
}

// export const transform = <F, G>(outer: IMonad<F>, inner: IMonad<G>, innerBind: IMonad<G>['bind']) => {
//     const lift = <A>(a: KApp<F, A>): KApp<F, Array<A>> => outer.map(a, m.unit);

//     const mt = monad<KApp<KTransform<KArray>, F>>({
//         unit: <A>(a: A): KApp<F, Array<A>> => outer.unit(m.unit(a)),
//         bind: <A, B>(fa: KApp<F, Array<A>>, f: (a: A) => KApp<F, Array<B>>): KApp<F, Array<B>> =>
//             outer.bind(fa, ae => outer.map(outer.sequence(ae.map(f)), a => a.flat()))
//     }); 

//     return { ...mt, lift };
// }
