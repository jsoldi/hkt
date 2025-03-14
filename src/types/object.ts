import { $, KRoot } from "../core/hkt.js";
import { functor, IFunctor } from "../classes/functor.js";
import { IMonoid, monoid } from "../classes/monoid.js";
import { ITraversable, traversable } from "../classes/traversable.js";
import { array } from "./array.js";
import { maybe, Maybe } from "./maybe.js";
import { Reader } from "./reader.js";
import { IMonad } from "../classes/monad.js";

type K = keyof any;

/** The higher-kinded type of TypeScript's `Record` type. */
export interface KObject extends KRoot {
    readonly 0: unknown
    readonly body: Record<K, this[0]>
}

/** The object interface, providing a set of functions for working with JavaScript objects. */
export interface IObject extends IFunctor<KObject>, ITraversable<KObject>, IMonoid<KObject> {
    /** Returns an array of key-value pairs from the given object. */
    entries<A>(fa: Record<K, A>): [K, A][]
    /** Returns an array of keys from the given object. */
    keys<A>(fa: Record<K, A>): K[]
    /** Returns an array of values from the given object. */
    values<A>(fa: Record<K, A>): A[]
    /** Maps the values and keys of the given object using the given function and produces a new object. */
    rebuild<T extends Record<K, any>, B>(fa: T, f: (a: T[keyof T], k: keyof T) => [B, K]): { [K in keyof T]: B }
    /** Maps the values and keys of the given object using the given function and produces a new object. */
    map<T extends Record<K, any>, R>(obj: T, f: (a: T[keyof T], k: K) => R): { [K in keyof T]: R }
    /** Maps the values and keys of the given object using the given function and produces a new object. */
    map<A, B>(fa: Record<K, A>, f: (a: A, k: K) => B): Record<K, B>
    /** Converts the given object into a reader, where non-existent keys return `Nothing`. */
    toReader<A>(fa: Record<K, A>): Reader<K, Maybe<A>>
    /** Converts the given reader into an object having the specified keys. */
    fromReader(keys: K[]): <A>(r: Reader<K, A>) => Record<K, A>
}

/** The object module, providing a set of functions for working with JavaScript objects. */
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
            traverse: <M>(m: IMonad<M>) => <A, B>(f: (a: A) => $<M, B>) => (ta: Record<K, A>): $<M, Record<K, B>> => {
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
