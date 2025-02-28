import { $, $K1 } from "../core/hkt.js";
import { IMonad, IMonadBase, monad } from "./monad.js";
import { IMonoid, IMonoidBase, monoid } from "./monoid.js";
import { TypeClassArg } from "./utilities.js";
import { pipe } from "../core/utils.js";
import { ISemiring, semiring } from "./semiring.js";

export interface IMonadPlus<F> extends IMonad<F>, IMonoid<F> {
    guard(b: unknown): $<F, null>
    semiring<M>(mult: IMonoid<M>): ISemiring<F, M>    
    from<A>(as: A[]): $<F, A>
    filter<A, B extends A>(f: (a: A) => a is B): (fa: $<F, A>) => $<F, B>
    filter<A>(f: (a: A) => unknown): (fa: $<F, A>) => $<F, A>
    some<A>(fa: $<F, A>): $<F, A[]>
    many<A>(fa: $<F, A>): $<F, A[]>
}

const is_monadPlus = Symbol("is_monadPlus");

export type MonadPlusArg<F> = TypeClassArg<IMonadBase<F> & IMonoidBase<F>, IMonadPlus<F>, typeof is_monadPlus>;

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

            const _semiring = <M>(mult: IMonoid<M>): ISemiring<F, M> => semiring<F, M>({ sum: base, mult: base.liftMonoid(mult) });

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

export interface IMonadPlusFactory {
    <F>(base: MonadPlusArg<F>): IMonadPlus<F>;
    /** Type T **must** have a single possible value like `null` or `undefined`. */
    const<const T>(t: T): IMonad<$K1<T>>;
    readonly void: IMonad<$K1<void>>;
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
_monadPlus.null = _monadPlus.const(null);

export const monadPlus: IMonadPlusFactory = _monadPlus;
