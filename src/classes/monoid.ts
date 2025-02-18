import { ITypeClass, $, $K } from "../core/hkt.js";
import { TypeClassArg } from "./utilities.js";
import { curry, pipe } from "../core/utils.js";

export interface ISemigroup<F> extends ITypeClass<F> {
    append: <A>(fa: $<F, A>, fb: $<F, A>) => $<F, A>
}

export interface IMonoidBase<F> extends ISemigroup<F> {
    empty: <A>() => $<F, A>
}

export interface IMonoid<F> extends IMonoidBase<F> {
    mappend<A>(fa: $<F, A>): (fb: $<F, A>) => $<F, A>
    concat<A>(fas: $<F, A>[]): $<F, A>
    when(b: unknown): <A>(fa: $<F, A>) => $<F, A>
    join<A>(separator: $<F, A>): (fas: $<F, A>[]) => $<F, A>
    dual(): IMonoid<F>
}

export function monoidFor<T>(empty: T, append: (a: T, b: T) => T) {
    return monoid<$<$K, T>>({
        empty: () => empty,
        append: (a, b) => append(a, b)
    });
}

const is_monoid = Symbol("is_monoid");

export function monoid<F>(base: TypeClassArg<IMonoidBase<F>, IMonoid<F>, typeof is_monoid>): IMonoid<F> {
    if (is_monoid in base)
        return base;

    return pipe(
        base,
        base => {
            const mappend = curry(base.append);
            const concat = <A>(fas: $<F, A>[]) => fas.reduce(base.append, base.empty<A>());

            return {
                mappend,
                concat,
                ...base
            }
        },
        base => {
            const when = (b: unknown) => <A>(fa: $<F, A>) => b ? fa : base.empty<A>();

            const join = <A>(separator: $<F, A>) => (fas: $<F, A>[]) => {
                if (fas.length === 0)
                    return base.empty<A>();
        
                const [head, ...tail] = fas;
                return tail.reduce((acc, a) => base.append(base.append(acc, separator), a), head);
            };

            const dual = () => monoid({
                empty: base.empty,
                append: (a, b) => base.append(b, a),
            });

            return {
                [is_monoid]: true,
                when,
                join,
                dual,
                ...base,
            }
        }
    );
}
