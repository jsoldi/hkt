import { functor, IFunctor } from "./functor.js";
import { $, $B2, ITypeClass } from "../core/hkt.js"
import { IMonoid, IMonoidBase, monoid } from "./monoid.js";
import { TypeClassArg } from "./utilities.js";
import { pipe, uncurry } from "../core/utils.js";

export interface IApplicativeBase<F> extends ITypeClass<F> {
    unit<A>(a: A): $<F, A>
    apply<A, B>(fab: $<F, (a: A) => B>): (fa: $<F, A>) => $<F, B>
}

export interface IApplicative<F> extends IApplicativeBase<F>, IFunctor<F> {
    lift2<A, B, C>(f: (a: A, b: B) => C): (fa: $<F, A>, fb: $<F, B>) => $<F, C>
    lift3<A, B, C, D>(f: (a: A, b: B, c: C) => D): (fa: $<F, A>, fb: $<F, B>, fc: $<F, C>) => $<F, D>
    liftMonoid<M>(m: IMonoidBase<M>): IMonoid<$B2<F, M>>
    nestApplicative<M>(ap: IApplicativeBase<M>): IApplicative<$B2<F, M>>
}

const is_applicative = Symbol("is_applicative");

export function applicative<F>(base: TypeClassArg<IApplicativeBase<F>, IApplicative<F>, typeof is_applicative>): IApplicative<F> {
    if (is_applicative in base) 
        return base;

    return pipe(
        base,
        base => ({
            ...functor<F>({
                map: (fa, f) => base.apply(base.unit(f))(fa),
                ...base,
            }),
            ...base
        }),
        base => {
            const lift2 = <A, B, C>(f: (a: A, b: B) => C) => (fa: $<F, A>, fb: $<F, B>): $<F, C> => 
                base.apply<B, C>(base.map<A, (b: B) => C>(fa, a => (b: B) => f(a, b)))(fb);
        
            const lift3 = <A, B, C, D>(f: (a: A, b: B, c: C) => D) => (fa: $<F, A>, fb: $<F, B>, fc: $<F, C>): $<F, D> => 
                base.apply(base.apply(base.map(fa, a => (b: B) => (c: C) => f(a, b, c)))(fb))(fc);
        
            const liftMonoid = <M>(m: IMonoidBase<M>) => {
                return monoid<$B2<F, M>>({
                    empty: () => base.unit(m.empty()),
                    append: lift2(m.append)
                });
            };

            const nestApplicative = <M>(ap: IApplicativeBase<M>) => {
                const _ap = applicative<M>(ap);

                return applicative<$B2<F, M>>({
                    unit: a => base.unit(_ap.unit(a)),
                    map: (fa, f) => base.map(fa, ma => _ap.map(ma, f)),
                    apply: fab => fa => lift2(uncurry(_ap.apply))(fab, fa)
                });    
            }

            return {
                [is_applicative]: true,
                lift2,
                lift3,
                liftMonoid,
                nestApplicative,
                ...base
            };
        }
    )
}
