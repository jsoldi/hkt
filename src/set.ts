import { $I, KRoot } from "./hkt.js";
import { IMonadPlus, monadPlus } from "./monadPlus.js";
import { fold, IFold } from "./fold.js";
import { ITrivial, trivial } from "./trivial.js";

interface KSet extends KRoot {
    readonly 0: unknown
    readonly body: Set<this[0]>
}

interface ISet extends IMonadPlus<KSet>, IFold<KSet, $I> {
    readonly scalar: ITrivial;
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
    const unit = <A>(a: A): Set<A> => new Set([a]);
    const bind = <A, B>(fa: Set<A>, f: (a: A) => Set<B>): Set<B> => new Set([...fa].flatMap(a => [...f(a)]));
    const foldl = <A, B>(f: (b: B, a: A) => B) => (b: B) => (fa: Set<A>): B => [...fa].reduce(f, b);
    const map = <A, B>(fa: Set<A>, f: (a: A) => B): Set<B> => new Set([...fa].map(f));
    const scalar = trivial;

    return {
        ...fold<KSet, $I>({
            map,
            foldl,
            wrap: unit,
            scalar,
        }),
        scalar,
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
