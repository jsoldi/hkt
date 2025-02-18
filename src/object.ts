import { IApplicative } from "./applicative.js";
import { array } from "./array.js";
import { functor, IFunctor } from "./functor.js";
import { $, KRoot } from "./hkt.js";
import { maybe, Maybe } from "./maybe.js";
import { IMonoid, monoid } from "./monoid.js";
import { Reader } from "./reader.js";
import { ITraversable, traversable } from "./traversable.js";

type K = keyof any;

export interface KObject extends KRoot {
    readonly 0: unknown
    readonly body: Record<K, this[0]>
}

interface IObject extends IFunctor<KObject>, ITraversable<KObject>, IMonoid<KObject> {
    entries<A>(fa: Record<K, A>): [K, A][]
    keys<A>(fa: Record<K, A>): K[]
    values<A>(fa: Record<K, A>): A[]
    rebuild<T extends Record<K, any>, B>(fa: T, f: (a: T[keyof T], k: keyof T) => [B, K]): { [K in keyof T]: B }
    map<T extends Record<K, any>, R>(obj: T, f: (a: T[keyof T], k: K) => R): { [K in keyof T]: R }
    map<A, B>(fa: Record<K, A>, f: (a: A, k: K) => B): Record<K, B>
    fmap<T extends Record<K, any>, B>(f: (a: T[keyof T]) => B): (fa: T) => { [K in keyof T]: B }
    fmap<T extends Record<K, any>, B, C>(f: (a: T[keyof T]) => B, g: (b: B) => C): (fa: T) => { [K in keyof T]: C }
    fmap<T extends Record<K, any>, B, C, D>(f: (a: T[keyof T]) => B, g: (b: B) => C, h: (c: C) => D): (fa: T) => { [K in keyof T]: D }
    toReader<A>(fa: Record<K, A>): Reader<K, Maybe<A>>
    fromReader(keys: K[]): <A>(r: Reader<K, A>) => Record<K, A>
}

export const object: IObject = (() => {
    const rebuild = <T extends Record<K, any>, B>(fa: T, f: (a: T[keyof T], k: keyof T) => [B, K]): { [K in keyof T]: B } => {
        const result: Record<K, B> = {};

        for (const key in fa) {
            const [value, newKey] = f(fa[key], key);
            result[newKey] = value;
        }

        return result as { [K in keyof T]: B };
    };

    const entries = <A>(fa: Record<K, A>): [K, A][] => Object.entries(fa);
    const keys = <A>(fa: Record<K, A>): K[] => Object.keys(fa);
    const values = <A>(fa: Record<K, A>): A[] => Object.values(fa);
    const map = <A, B>(fa: Record<K, A>, f: (a: A, k: K) => B) => rebuild(fa, (a, k) => [f(a, k), k]);
    const toReader = <A>(fa: Record<K, A>) => (key: K) => key in fa ? maybe.just(fa[key]) : maybe.nothing;
    const fromReader = (keys: K[]) => <A>(r: Reader<K, A>): Record<K, A> => Object.fromEntries(keys.map(k => [k, r(k)]));

    return {
        ...functor<KObject>({ map }),
        ...monoid<KObject>({
            empty: () => ({}),
            append: (a, b) => ({ ...a, ...b })
        }),
        ...traversable<KObject>({
            traverse: <M>(m: IApplicative<M>) => <A, B>(f: (a: A) => $<M, B>) => (ta: Record<K, A>): $<M, Record<K, B>> => {
                return m.map(
                    array.traverse(m)(([key, a]: [K, A]) => m.map(f(a), b => [key, b] as const))(Object.entries(ta)),
                    telas => Object.fromEntries(telas) as Record<K, B>
                );
            }
        }),
        toReader,
        fromReader,
        map,
        entries,
        keys,
        values,
        rebuild,
    };
})();
