import { KApp, KRoot } from "./hkt.js";
import { IMonad, monad } from "./monad.js";

export interface ITransform<F, G> extends IMonad<KTransform<F, G>> {
    lift<A>(a: KApp<G, A>): KApp<G, KApp<F, A>>
    flatten<A>(fa: KApp<F, KApp<G, KApp<F, A>>>): KApp<G, KApp<F, A>>
}

export interface ITransformer<F> {
    readonly transform: <G>(outer: IMonad<G>) => ITransform<F, G>
}

export interface KTransform<F, G> extends KRoot {
    readonly 0: unknown
    readonly body: KApp<G, KApp<F, this[0]>>
}

type TBind<F> = <G>(outer: IMonad<G>) => <A, B>(fa: KApp<G, KApp<F, A>>, f: (a: A) => KApp<G, KApp<F, B>>) => KApp<G, KApp<F, B>>

export const transformer = <F>(inner: IMonad<F>, tBind: TBind<F>) => <G>(outer: IMonad<G>): ITransform<F, G> => {
    const lift = <A>(a: KApp<G, A>): KApp<G, KApp<F, A>> => outer.map(a, inner.unit);
    const unit = <A>(a: A): KApp<G, KApp<F, A>> => outer.unit(inner.unit(a))
    const bind = tBind(outer);
    const flatten = <A>(fa: KApp<F, KApp<G, KApp<F, A>>>): KApp<G, KApp<F, A>> => bind(outer.unit(fa), a => a);
    const m = monad<KTransform<F, G>>({ unit, bind });
    return { ...m, lift, flatten };
}
