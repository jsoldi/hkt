import { $I, KRoot } from "./hkt.js";
import { IMonadPlus } from "./monadPlus.js";
import { monadFold } from "./monadFold.js";
import { ITrivial, trivial } from "./trivial.js";

interface KSet extends KRoot {
    readonly 0: unknown
    readonly body: Set<this[0]>
}

interface ISet extends IMonadPlus<KSet> {
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

    return {
        ...monadFold<KSet, $I>({
            unit,
            bind,
            map: (fa, f) => new Set([...fa].map(f)),
            empty: () => new Set(),
            append: (fa, fb) => fa.union(fb),
            foldl,
            wrap: unit,
            scalar: trivial,
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
