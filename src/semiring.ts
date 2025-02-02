import { $, ITypeClass } from "./hkt.js";
import { IMonoid, IMonoidBase, monoid } from "./monoid.js";
import { memo } from "./utils.js";

export interface ISemiringBase<F> extends ITypeClass<F> {
    readonly sum: IMonoidBase<F>
    readonly mult: IMonoidBase<F>
}

export interface ISemiring<F> extends ISemiringBase<F> {
    readonly sum: IMonoid<F>
    readonly mult: IMonoid<F>
    zero<A>(): $<F, A>
    one<A>(): $<F, A>
    plus<A>(a: $<F, A>, b: $<F, A>): $<F, A>
    times<A>(a: $<F, A>, b: $<F, A>): $<F, A>
    fromNatural<A>(nat: number): $<F, A>
}

export function semiring<F>({ sum: _sum, mult: _mult }: ISemiringBase<F>): ISemiring<F> {
    const zero = _sum.empty;
    const one = _mult.empty;
    const plus = _sum.append;
    const times = _mult.append;
    const sum = memo(() => monoid<F>(_sum));
    const mult = memo(() => monoid<F>(_mult));

    return {
        zero,
        one,
        plus,
        times,
        fromNatural: <A>(natural: number) => {
            let result = zero<A>();

            for (let i = 0; i < natural; i++) 
                result = plus(result, one());
            
            return result;
        },
        get sum() { return sum() },
        get mult() { return mult() }
    }
}
