import { $, $K1 } from "../core/hkt.js";
import { IMonad, IMonadBase, monad } from "./monad.js";
import { IMonoid, IMonoidBase, monoid } from "./monoid.js";
import { TypeClassArg } from "./utilities.js";
import { pipe } from "../core/utils.js";
import { ISemiring, semiring } from "./semiring.js";

/** The monad plus interface. */
export interface IMonadPlus<F> extends IMonad<F>, IMonoid<F> {
    /** Guards a value based on a boolean condition. */
    guard(b: unknown): $<F, null>
    /** Creates a semiring from a monoid where addition is this monadPlus and multiplication is the given monoid. */
    semiring<M>(mult: IMonoid<M>): ISemiring<F, M>    
    /** Creates a monad from an array of values. */
    from<A>(as: A[]): $<F, A>
    /** Filters values in a monadPlus based on a predicate. */
    filter<A, B extends A>(f: (a: A) => a is B): (fa: $<F, A>) => $<F, B>
    filter<A>(f: (a: A) => unknown): (fa: $<F, A>) => $<F, A>
    /** Applies a monadic action zero or more times. */
    some<A>(fa: $<F, A>): $<F, A[]>
    /** Applies a monadic action one or more times. */
    many<A>(fa: $<F, A>): $<F, A[]>
}

const is_monadPlus = Symbol("is_monadPlus");

export type MonadPlusArg<F> = TypeClassArg<IMonadBase<F> & IMonoidBase<F>, IMonadPlus<F>, typeof is_monadPlus>;

/** Creates a `IMonadPlus` from an instance of `IMonadBase` and `IMonoidBase`. */
export function _monadPlus<F>(base: MonadPlusArg<F>): IMonadPlus<F> {   
    if (is_monadPlus in base) 
        return base;

    return pipe(
        base,
        base => ({
            ...monoid(base),
            ...monad(base),
            ...base
        }),      
        base => {
            const guard = (b: unknown) => b ? base.unit(null) : base.empty<null>();

            const from = <A>(as: A[]) => 
                as.reduce((acc, a) => base.append(acc, base.unit(a)), base.empty<A>());

            const _semiring = <M>(mult: IMonoid<M>): ISemiring<F, M> => semiring<F, M>({ sum: base, mult: mult.liftMonoid(base) });

            const filter = <A>(f: (a: A) => unknown) => (fa: $<F, A>) => base.bind(fa, a => f(a) ? base.unit(a) : base.empty<A>());

            const some = <A>(fa: $<F, A>): $<F, A[]> => base.bind(
                fa, 
                a => base.map(
                    base.append(some(fa), base.unit<A[]>([])),
                    as => [a, ...as]
                )
            );

            const many = <A>(fa: $<F, A>): $<F, A[]> => base.append(some(fa), base.unit<A[]>([]));

            return {
                [is_monadPlus]: true,
                guard,
                from,
                semiring: _semiring,
                filter,
                some,
                many,
                ...base,
            }
        }
    );
}

/** The monad plus factory. */
export interface IMonadPlusFactory {
    /** Creates a monad plus from a monad and a monoid. */
    <F>(base: MonadPlusArg<F>): IMonadPlus<F>;
    /** Creates a constant monadPlus. Type T **must** have a single instance such as `null`. */
    const<const T>(t: T): IMonad<$K1<T>>;
    /** The void constant. */
    readonly void: IMonad<$K1<void>>;
    /** Creates a monad plus with a null type. */
    readonly null: IMonad<$K1<null>>;
}

_monadPlus.const = <T>(t: T) => _monadPlus<$K1<T>>({
    unit: () => t,
    bind: () => t,
    map: () => t,
    flatMap: () => () => t,
    flat: () => t,
    empty: () => t,
    append: () => t,
});

_monadPlus.void = _monadPlus.const<void>(undefined);
_monadPlus.null = _monadPlus.const<null>(null);

/** The monad plus factory. */
export const monadPlus: IMonadPlusFactory = _monadPlus;
