import { $, $K, KRoot } from "./hkt.js";
import { functor, IFunctor } from "./functor.js";
import { IMonoid, monoid } from "./monoid.js";
import { ICollapsible } from "./collapsible.js";

interface KSet extends KRoot {
    readonly 0: unknown
    readonly body: Set<this[0]>
}

interface ISet extends IMonoid<KSet>, IFunctor<KSet>, ICollapsible<KSet> {
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
    const collapse = <A>(monoid: IMonoid<$<$K, A>>) => (fa: Set<A>): Set<A> => new Set<A>([[...fa].reduce(monoid.append, monoid.empty())]);

    return {
        ...functor<KSet>({
            map: (fa, f) => new Set([...fa].map(f))
        }),
        ...monoid<KSet>({
            empty: () => new Set(),
            append: (fa, fb) => fa.union(fb)
        }),
        union,
        intersection,
        difference,
        symmetricDifference,
        isSubsetOf,
        isSupersetOf,
        isDisjointFrom,
        collapse
    };
})();
