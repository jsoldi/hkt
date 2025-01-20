import { $I, KRoot } from "./hkt.js";
import { functor, IFunctor } from "./functor.js";
import { IMonoid, monoid } from "./monoid.js";
import { arrayLike, IArrayLike } from "./array-like.js";
import { trivial } from "./trivial.js";

interface KSet extends KRoot {
    readonly 0: unknown
    readonly body: Set<this[0]>
}

interface ISet extends IMonoid<KSet>, IFunctor<KSet>, IArrayLike<KSet, $I> {
    union: <A>(fa: Set<A>) => (fb: Set<A>) => Set<A>
    intersection: <A>(fa: Set<A>) => (fb: Set<A>) => Set<A>
    difference: <A>(fa: Set<A>) => (fb: Set<A>) => Set<A>
    symmetricDifference: <A>(fa: Set<A>) => (fb: Set<A>) => Set<A>
    isSubsetOf: <A>(fa: Set<A>) => (fb: Set<A>) => boolean
    isSupersetOf: <A>(fa: Set<A>) => (fb: Set<A>) => boolean
    isDisjointFrom: <A>(fa: Set<A>) => (fb: Set<A>) => boolean
}

export const set: ISet = (() => {
    const union = <A>(fa: Set<A>) => (fb: Set<A>): Set<A> => fa.union(fb);
    const intersection = <A>(fa: Set<A>) => (fb: Set<A>): Set<A> => fa.intersection(fb);
    const difference = <A>(fa: Set<A>) => (fb: Set<A>): Set<A> => fa.difference(fb);
    const symmetricDifference = <A>(fa: Set<A>) => (fb: Set<A>): Set<A> => fa.symmetricDifference(fb);
    const isSubsetOf = <A>(fa: Set<A>) => (fb: Set<A>): boolean => fa.isSubsetOf(fb);
    const isSupersetOf = <A>(fa: Set<A>) => (fb: Set<A>): boolean => fa.isSupersetOf(fb);
    const isDisjointFrom = <A>(fa: Set<A>) => (fb: Set<A>): boolean => fa.isDisjointFrom(fb);
    const toArray = <A>(fa: Set<A>): A[] => [...fa];
    const fromArray = <A>(as: A[]): Set<A> => new Set(as);
    const filter = <A>(p: (a: A) => boolean) => (fa: Set<A>): Set<A> => new Set([...fa].filter(p));

    return {
        ...functor<KSet>({
            map: (fa, f) => new Set([...fa].map(f))
        }),
        ...monoid<KSet>({
            empty: () => new Set(),
            append: (fa, fb) => fa.union(fb)
        }),
        ...arrayLike<KSet, $I>({
            toArray,
            fromArray,
            scalar: trivial
        }),
        union,
        intersection,
        difference,
        symmetricDifference,
        isSubsetOf,
        isSupersetOf,
        isDisjointFrom,
        filter,
    };
})();
