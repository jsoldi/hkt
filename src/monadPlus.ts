import { $ } from "./hkt.js";
import { IMonad, IMonadBase, monad } from "./monad.js";
import { IMonoid, IMonoidBase, monoid } from "./monoid.js";
import { pipe } from "./utils.js";

export interface IMonadPlus<F> extends IMonad<F>, IMonoid<F> {
    filter<A, B extends A>(f: (a: A) => a is B): (fa: $<F, A>) => $<F, B>
    filter<A>(f: (a: A) => boolean): (fa: $<F, A>) => $<F, A>
    guard(b: boolean): $<F, null>
    from<A>(as: A[]): $<F, A>
}

export function monadPlus<F>(base: IMonadBase<F> & IMonoidBase<F> & Partial<IMonadPlus<F>>): IMonadPlus<F> {   
    return pipe(
        base,
        base => ({
            ...monoid(base),
            ...monad(base),
            ...base
        }),
        base => {
            const filter = <A>(f: (a: A) => boolean) => (fa: $<F, A>) => base.bind(fa, a => f(a) ? base.unit(a) : base.empty<A>());
            const guard = (b: boolean) => b ? base.unit(null) : base.empty<null>();
        
            const from = <A>(as: A[]) => 
                as.reduce((acc, a) => base.append(acc, base.unit(a)), base.empty<A>());
        
            return {
                filter,
                guard,
                from,
                ...base,
            }
        }
    );
}
