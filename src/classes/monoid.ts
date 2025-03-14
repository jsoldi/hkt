import { ITypeClass, $, $K1, $B2 } from "../core/hkt.js";
import { TypeClassArg } from "./utilities.js";
import { curry, pipe } from "../core/utils.js";
import { IMonad } from "./monad.js";

/** The minimal definition of a semigroup. */
export interface ISemigroup<F> extends ITypeClass<F> {
    /** Combines two values using an associative operation. */
    append: <A>(fa: $<F, A>, fb: $<F, A>) => $<F, A>
}

/** The minimal definition of a monoid. */
export interface IMonoidBase<F> extends ISemigroup<F> {
    /** Provides the identity element. */
    empty: <A>() => $<F, A>
}

/** The monoid interface, providing functions for working with monoids. */
export interface IMonoid<F> extends IMonoidBase<F> {
    /** Combines two values using an associative operation. */
    mappend<A>(fa: $<F, A>): (fb: $<F, A>) => $<F, A>
    /** Combines a list of values. */
    concat<A>(fas: $<F, A>[]): $<F, A>
    /** Returns the value if the condition is true, otherwise returns the identity element. */
    when(b: unknown): <A>(fa: $<F, A>) => $<F, A>
    /** Combines a list of values with a separator. */
    join<A>(separator: $<F, A>): (fas: $<F, A>[]) => $<F, A>
    /** Returns the dual monoid with the operation reversed. */
    dual(): IMonoid<F>
    /** Lifts this monoid into a monad. */
    liftMonoid<M>(m: IMonad<M>): IMonoid<$B2<M, F>>
}

const is_monoid = Symbol("is_monoid");

export type MonoidArg<F> = TypeClassArg<IMonoidBase<F>, IMonoid<F>, typeof is_monoid>;

/** Creates an `IMonoid` from an `IMonoidBase`. */
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

/** The monoid factory. */
export interface IMonoidFactory {
    /** Creates an `IMonoid` from an `IMonoidBase`. */
    <F>(base: MonoidArg<F>): IMonoid<F>;
    /** Creates an `IMonoid` with a fixed type argument. */
    concrete<T>(empty: T, append: (a: T, b: T) => T): IMonoid<$K1<T>>;
}

_monoid.concrete = <T>(empty: T, append: (a: T, b: T) => T) => _monoid<$K1<T>>({
    empty: () => empty,
    append: (a, b) => append(a, b)
});

/** The monoid factory, providing functions for working with monoids. */
export const monoid: IMonoidFactory = _monoid;
