import { KApp } from "./hkt.js";
import { IMonad } from "./monad.js";
import { IMonoid } from "./monoid.js";

export interface IMonadPlus<F> extends IMonad<F>, IMonoid<F> {
    filter<A>(f: (a: A) => boolean): (fa: KApp<F, A>) => KApp<F, A>
    guard(b: boolean): KApp<F, null>
    from<A>(as: A[]): KApp<F, A>
}

export function monadPlus<F>(base: IMonad<F> & IMonoid<F>): IMonadPlus<F> {   
    const filter = <A>(f: (a: A) => boolean) => (fa: KApp<F, A>) => base.bind(fa, a => f(a) ? base.unit(a) : base.empty<A>());
    const guard = (b: boolean) => b ? base.unit(null) : base.empty<null>();

    const from = <A>(as: A[]) => 
        as.reduce((acc, a) => base.append(acc, base.unit(a)), base.empty<A>());

    return {
        ...base,
        filter,
        guard,
        from,
    }
}
