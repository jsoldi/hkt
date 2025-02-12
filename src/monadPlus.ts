import { $, $3, $B } from "./hkt.js";
import { IMonad, IMonadBase, monad } from "./monad.js";
import { IMonoid, IMonoidBase, monoid } from "./monoid.js";
import { ISemiring, semiring } from "./semiring.js";
import { pipe } from "./utils.js";

export interface IMonadPlus<F> extends IMonad<F>, IMonoid<F> {
    filter<A, B extends A>(f: (a: A) => a is B): (fa: $<F, A>) => $<F, B>
    filter<A>(f: (a: A) => unknown): (fa: $<F, A>) => $<F, A>
    guard(b: unknown): $<F, null>
    from<A>(as: A[]): $<F, A>
    semiring<M>(mult: IMonoid<M>): ISemiring<$3<$B, F, M>>    
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
            const filter = <A>(f: (a: A) => unknown) => (fa: $<F, A>) => base.bind(fa, a => f(a) ? base.unit(a) : base.empty<A>());
            const guard = (b: unknown) => b ? base.unit(null) : base.empty<null>();
        
            const from = <A>(as: A[]) => 
                as.reduce((acc, a) => base.append(acc, base.unit(a)), base.empty<A>());

            const _semiring = <M>(mult: IMonoid<M>): ISemiring<$3<$B, F, M>> => semiring<$3<$B, F, M>>({
                sum: { empty: base.empty, append: base.append },
                mult: { empty: () => base.unit(mult.empty()), append: base.lift2(mult.append) }   
            });

            return {
                filter,
                guard,
                from,
                semiring: _semiring,
                ...base,
            }
        }
    );
}
