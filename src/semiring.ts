import { $ } from "./hkt.js";
import { IMonoid, IMonoidBase, monoid } from "./monoid.js";

export interface ISemiringBase<F> {
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

export function semiring<F>({ sum, mult }: ISemiringBase<F>): ISemiring<F> {
    const zero = sum.empty;
    const one = mult.empty;
    const plus = sum.append;
    const times = mult.append;

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
        // TODO: Would it be worth memoizing these?
        sum: monoid<F>(sum),   
        mult: monoid<F>(mult)
    }
}
