import { ITypeClass, $, $K, $3, $B } from "./hkt.js";
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
    liftMonoidUnder<M>(m: IMonad<M>): IMonoid<$3<$B, M, F>>
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

            const dual = () => monoid({
                empty: base.empty,
                append: (a, b) => base.append(b, a),
            });
            
            const liftMonoidUnder = <M>(m: IMonad<M>) => {
                return monoid<$3<$B, M, F>>({ 
                    empty: () => m.unit(base.empty()),
                    append: m.lift2(base.append)
                });
            }

            return {
                when,
                foldMap,
                join,
                dual,
                liftMonoidUnder,
                ...base,
            }
        }
    );
}
