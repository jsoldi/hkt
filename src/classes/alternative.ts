import { applicative, IApplicative, IApplicativeBase } from "./applicative.js";
import { $ } from "../core/hkt.js"
import { IMonoid, IMonoidBase, monoid } from "./monoid.js";
import { ISemiring, semiring } from "./semiring.js";
import { TypeClassArg } from "./utilities.js";
import { pipe } from "../core/utils.js";

export interface IAlternative<F> extends IApplicative<F>, IMonoid<F> {
    guard(b: unknown): $<F, null>
    semiring<M>(mult: IMonoid<M>): ISemiring<F, M>    
    from<A>(as: A[]): $<F, A>
}

const is_alternative = Symbol("is_alternative");

export function alternative<F>(base: TypeClassArg<IApplicativeBase<F> & IMonoidBase<F>, IAlternative<F>, typeof is_alternative>): IAlternative<F> {
    if (is_alternative in base) 
        return base;

    return pipe(
        base,
        base => ({
            ...monoid(base),
            ...applicative(base),
            ...base
        }),
        base => {
            const guard = (b: unknown) => b ? base.unit(null) : base.empty<null>();

            const from = <A>(as: A[]) => 
                as.reduce((acc, a) => base.append(acc, base.unit(a)), base.empty<A>());

            const _semiring = <M>(mult: IMonoid<M>): ISemiring<F, M> => semiring<F, M>({ sum: base, mult: base.liftMonoid(mult) });

            return {
                [is_alternative]: true,  
                guard,
                from,
                semiring: _semiring,
                ...base
            };
        }
    )
}
