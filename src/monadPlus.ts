import { KApp } from "./hkt.js";
import { IMonad, IMonadBase, monad } from "./monad.js";
import { IMonoid, IMonoidBase, monoid } from "./monoid.js";

export interface IMonadPlus<F> extends IMonad<F>, IMonoid<F> {
    filter: <A>(f: (a: A) => boolean) => (fa: KApp<F, A>) => KApp<F, A>
}

export function monadPlus<F>(base: IMonadBase<F> & IMonoidBase<F>): IMonadPlus<F> {
    const _monad = monad<F>(base);
    const _monoid = monoid<F>(base);
    
    const filter = <A>(f: (a: A) => boolean) => (fa: KApp<F, A>) => _monad.bind(fa, a => f(a) ? _monad.unit(a) : _monoid.empty<A>());

    return {
        ..._monad,
        ..._monoid,
        filter
    }
}
