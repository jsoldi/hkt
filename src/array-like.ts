import { IFunctor } from "./functor.js";
import { $, $K } from "./hkt.js";
import { IMonoid } from "./monoid.js";
import { chain, pipe } from "./utils.js";

export interface IToArrayBase<F, G> {
    readonly scalar: IFunctor<G>
    toArray<A>(fa: $<F, A>): $<G, A[]>
}

export interface IArrayLikeBase<F, G> extends IToArrayBase<F, G> {    
    fromArray<A>(as: $<G, A[]>): $<F, A>
}

export interface IToArray<F, G> extends IToArrayBase<F, G> {
    collapse<A>(monoid: IMonoid<$<$K, A>>): (fsa: $<F, A>) => $<G, A>
}

export interface IArrayLike<F, G> extends IArrayLikeBase<F, G>, IToArray<F, G> {
    expand<A>(fsa: $<G, A>): $<F, A>
    filter<A, B extends A>(f: (a: A) => a is B): (fa: $<F, A>) => $<F, B>
    filter<A>(p: (a: A) => unknown): (fa: $<F, A>) => $<F, A>
}

export function toArray<F, G>(base: IToArrayBase<F, G>): IToArray<F, G> {
    type I = IToArray<F, G>;

    const collapse: I['collapse'] = monoid => chain(
        base.toArray,
        base.scalar.fmap(a => a.reduce(monoid.append, monoid.empty())),
    );

    return {
        ...base,
        collapse,
    }
}

export function arrayLike<F, G>(base: IArrayLikeBase<F, G>): IArrayLike<F, G> {
    type I = IArrayLike<F, G>;

    return pipe(
        base,
        base => ({
            ...toArray(base),
            ...base
        }),
        base => {
            const expand: I['expand'] = chain(
                base.scalar.fmap(a => [a]),
                base.fromArray,
            );
        
            const filter: I['filter'] = <A>(p: (a: A) => unknown) => chain(
                base.toArray<A>,
                base.scalar.fmap(a => a.filter(p)),
                base.fromArray,
            );

            return {
                ...base,
                expand,
                filter,
            }            
        }
    )
}
