import { ITypeClass, $, $B, $N, $K } from "./hkt.js";
import { IMonad } from "./monad.js";
import { curry, pipe } from "./utils.js";

export interface IMonoidBase<F> extends ITypeClass<F> {
    empty: <A>() => $<F, A>
    append: <A>(fa: $<F, A>, fb: $<F, A>) => $<F, A>
}

export interface IMonoid<F> extends IMonoidBase<F> {
    mappend<A>(fa: $<F, A>): (fb: $<F, A>) => $<F, A>
    concat<A>(fas: $<F, A>[]): $<F, A>
    when(b: boolean): <A>(fa: $<F, A>) => $<F, A>
    foldMap<A>(as: A[]): <B>(f: (a: A) => $<F, B>) => $<F, B>
    join<A>(separator: $<F, A>): (fas: $<F, A>[]) => $<F, A>
    dual(): IMonoid<F>
    product<M>(mult: IMonad<M>): IMonoid<$N<[$B, M, F]>>
    repeat(times: number): <A>(fa: $<F, A>) => $<F, A>
}

export function monoidFor<T>(empty: T, append: (a: T, b: T) => T) {
    return monoid<$<$K, T>>({
        empty: () => empty,
        append: (a, b) => append(a, b)
    });
}

export function monoid<F>(base: IMonoidBase<F> & Partial<IMonoid<F>>): IMonoid<F> {
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
            const when = (b: boolean) => <A>(fa: $<F, A>) => b ? fa : base.empty<A>();

            const foldMap = <A>(as: A[]) => <B>(f: (a: A) => $<F, B>) => base.concat(as.map(f));

            const join = <A>(separator: $<F, A>) => (fas: $<F, A>[]) => {
                if (fas.length === 0)
                    return base.empty<A>();
        
                const [head, ...tail] = fas;
                return tail.reduce((acc, a) => base.append(base.append(acc, separator), a), head);
            };
        
            const product = <M>(multiplier: IMonad<M>): IMonoid<$N<[$B, M, F]>> => {
                const empty = <A>(): $N<[$B, M, F, A]> => multiplier.unit(base.empty<A>());
                const append = multiplier.lift2(base.append);
                return monoid<$N<[$B, M, F]>>({ empty, append });
            };

            const dual = () => monoid({
                empty: base.empty,
                append: (a, b) => base.append(b, a),
            });

            const repeat = (times: number) => <A>(fa: $<F, A>) => {
                let result = base.empty<A>();

                for (let i = 0; i < times; i++)
                    result = base.append(result, fa);

                return result;
            }

            return {
                when,
                foldMap,
                join,
                dual,
                product,
                repeat,
                ...base,
            }
        }
    );
}
