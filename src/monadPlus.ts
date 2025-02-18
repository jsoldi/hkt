import { alternative, IAlternative } from "./alternative.js";
import { $ } from "./hkt.js";
import { IMonad, IMonadBase, monad } from "./monad.js";
import { IMonoidBase, monoid } from "./monoid.js";
import { TypeClassArg } from "./utilities.js";
import { pipe } from "./utils.js";

export interface IMonadPlus<F> extends IMonad<F>, IAlternative<F> {
    filter<A, B extends A>(f: (a: A) => a is B): (fa: $<F, A>) => $<F, B>
    filter<A>(f: (a: A) => unknown): (fa: $<F, A>) => $<F, A>
}

const is_monadPlus = Symbol("is_monadPlus");

export function monadPlus<F>(base: TypeClassArg<IMonadBase<F> & IMonoidBase<F>, IMonadPlus<F>, typeof is_monadPlus>): IMonadPlus<F> {   
    if (is_monadPlus in base) 
        return base;

    return pipe(
        base,
        base => ({
            ...monoid(base),
            ...monad(base),
            ...base
        }),
        base => ({
            ...alternative(base),
            ...base
        }),        
        base => {
            const filter = <A>(f: (a: A) => unknown) => (fa: $<F, A>) => base.bind(fa, a => f(a) ? base.unit(a) : base.empty<A>());

            return {
                [is_monadPlus]: true,
                filter,
                ...base,
            }
        }
    );
}
