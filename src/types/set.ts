import { KRoot } from "../core/hkt.js";
import { IMonadPlus, monadPlus } from "../classes/monadPlus.js";

/** Higher-kinded Set type. */
export interface KSet extends KRoot {
    readonly 0: unknown
    readonly body: Set<this[0]>
}

/** The set interface, providing a set of functions for working with sets. */
export interface ISet extends IMonadPlus<KSet> {
    /** Produces a Set containing all the elements in the first set and also in the second set. */
    union: <A>(fa: Set<A>) => (fb: Set<A>) => Set<A>
    /** Produces a Set containing all the elements which are both in the first and second set. */
    intersection: <A>(fa: Set<A>) => (fb: Set<A>) => Set<A>
    /** Produces a Set containing all the elements in the first set but not in the second set. */
    difference: <A>(fa: Set<A>) => (fb: Set<A>) => Set<A>
    /** Produces a Set containing all the elements which are in either the first or second set but not both. */
    symmetricDifference: <A>(fa: Set<A>) => (fb: Set<A>) => Set<A>
    /** Determines if the first set is a subset of the second set. */
    isSubsetOf: <A>(fa: Set<A>) => (fb: Set<A>) => boolean
    /** Determines if the first set is a superset of the second set. */
    isSupersetOf: <A>(fa: Set<A>) => (fb: Set<A>) => boolean
    /** Determines if the first set is disjoint from the second set. */
    isDisjointFrom: <A>(fa: Set<A>) => (fb: Set<A>) => boolean
}

/** The set module, providing a set of functions for working with sets. */
export const set: ISet = (() => {
    const union = <A>(fa: Set<A>) => (fb: Set<A>): Set<A> => fa.union(fb);
    const intersection = <A>(fa: Set<A>) => (fb: Set<A>): Set<A> => fa.intersection(fb);
    const difference = <A>(fa: Set<A>) => (fb: Set<A>): Set<A> => fa.difference(fb);
    const symmetricDifference = <A>(fa: Set<A>) => (fb: Set<A>): Set<A> => fa.symmetricDifference(fb);
    const isSubsetOf = <A>(fa: Set<A>) => (fb: Set<A>): boolean => fa.isSubsetOf(fb);
    const isSupersetOf = <A>(fa: Set<A>) => (fb: Set<A>): boolean => fa.isSupersetOf(fb);
    const isDisjointFrom = <A>(fa: Set<A>) => (fb: Set<A>): boolean => fa.isDisjointFrom(fb);
    const unit = <A>(a: A): Set<A> => new Set([a]);
    const bind = <A, B>(fa: Set<A>, f: (a: A) => Set<B>): Set<B> => new Set([...fa].flatMap(a => [...f(a)]));
    const map = <A, B>(fa: Set<A>, f: (a: A) => B): Set<B> => new Set([...fa].map(f));

    return {
        ...monadPlus<KSet>({
            unit,
            bind,
            map,
            empty: () => new Set(),
            append: (fa, fb) => fa.union(fb),
        }),
        union,
        intersection,
        difference,
        symmetricDifference,
        isSubsetOf,
        isSupersetOf,
        isDisjointFrom
    };
})();
