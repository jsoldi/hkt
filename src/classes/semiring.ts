import { $, $3, $B, ITypeClass } from "../core/hkt.js";
import { IMonoid } from "./monoid.js";
import { TypeClassArg } from "./utilities.js";

/** The minimal definition of a semiring. */
export interface ISemiringBase<F, M> extends ITypeClass<F> {
    readonly sum: IMonoid<F>
    readonly mult: IMonoid<$3<$B, F, M>>
}

/** The semiring interface. */
export interface ISemiring<F, M> extends ISemiringBase<F, M> {
    /** The additive identity element. */
    zero<A>(): $<F, A>
    /** The multiplicative identity element. */
    one<A>(): $<F, $<M, A>>
    /** Adds two values. */
    plus<A>(...as: $<F, A>[]): $<F, A>
    /** Multiplies two values. */
    times<A>(...as: $<F, $<M, A>>[]): $<F, $<M, A>>
    /** Produces the value corresponding to the given natural number. */
    fromNatural<A>(nat: number): $<F, $<M, A>>
}

const is_semiring = Symbol("is_semiring");

/** Creates an `ISemiring` from an `ISemiringBase`. */
export function semiring<F, M>(base: TypeClassArg<ISemiringBase<F, M>, ISemiring<F, M>, typeof is_semiring>): ISemiring<F, M> {
    if (is_semiring in base) 
        return base;

    const zero = base.sum.empty;
    const one = base.mult.empty;

    return {
        ...{ [is_semiring]: true },
        zero,
        one,
        plus: (...as) => base.sum.concat(as),
        times: (...as) => base.mult.concat(as),
        fromNatural: function<A>(natural: number) {
            let result = zero<$<M, A>>();

            for (let i = 0; i < natural; i++)
                result = this.plus(result, one<A>());
            
            return result;
        },
        ...base,
    }
}
