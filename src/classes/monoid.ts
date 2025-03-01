import { ITypeClass, $, $K1, $B2 } from "../core/hkt.js";
import { TypeClassArg } from "./utilities.js";
import { curry, pipe } from "../core/utils.js";
import { IMonad } from "./monad.js";

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
    liftMonoid<M>(m: IMonad<M>): IMonoid<$B2<M, F>>
}

const is_monoid = Symbol("is_monoid");

export type MonoidArg<F> = TypeClassArg<IMonoidBase<F>, IMonoid<F>, typeof is_monoid>;

function _monoid<F>(base: MonoidArg<F>): IMonoid<F> {
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

            const dual = () => _monoid({
                empty: base.empty,
                append: (a, b) => base.append(b, a),
            });

            const liftMonoid = <M>(m: IMonad<M>) => {
                return monoid<$B2<M, F>>({
                    empty: () => m.unit(base.empty()),
                    append: m.lift2(base.append)
                });
            };

            return {
                [is_monoid]: true,
                when,
                join,
                dual,
                liftMonoid,
                ...base,
            }
        }
    );
}

export interface IMonoidFactory {
    <F>(base: MonoidArg<F>): IMonoid<F>;
    concrete<T>(empty: T, append: (a: T, b: T) => T): IMonoid<$K1<T>>;
}

_monoid.concrete = <T>(empty: T, append: (a: T, b: T) => T) => _monoid<$K1<T>>({
    empty: () => empty,
    append: (a, b) => append(a, b)
});

export const monoid: IMonoidFactory = _monoid;
