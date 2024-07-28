import { $, KRoot } from "./hkt.js";
import { functor, IFunctor } from "./functor.js";
import { IMonoid, monoid } from "./monoid.js";
import { Maybe, maybe } from "./maybe.js";

interface KMap extends KRoot {
    readonly 0: unknown
    readonly 1: unknown
    readonly body: Map<this[0], this[1]>
}

interface IMap<I> extends IMonoid<$<KMap, I>>, IFunctor<$<KMap, I>> {
    delete: <K, V>(key: K) => (m: Map<K, V>) => Map<K, V>
    get: <K, V>(key: K) => (m: Map<K, V>) => V | undefined
    getMaybe: <K, V>(key: K) => (m: Map<K, V>) => Maybe<V>
    has: <K, V>(key: K) => (m: Map<K, V>) => boolean
    set: <K, V>(key: K, value: V) => (m: Map<K, V>) => Map<K, V>
    size: <K, V>(m: Map<K, V>) => number
}

export function map<I>(): IMap<I> {
    const map = <A, B>(fa: Map<I, A>, f: (a: A) => B) => new Map([...fa].map(([k, v]) => [k, f(v)]))
    const empty = <A>() => new Map<I, A>();
    const append = <A>(fa: Map<I, A>, fb: Map<I, A>) => new Map([...fa, ...fb]);

    const _delete = <K, V>(key: K) => (m: Map<K, V>) => {
        const copy = new Map(m);
        copy.delete(key);
        return copy;
    }

    const get = <K, V>(key: K) => (m: Map<K, V>) => m.get(key);
    const getMaybe = <K, V>(key: K) => (m: Map<K, V>) => m.has(key) ? maybe.just(m.get(key)!) : maybe.nothing;
    const has = <K, V>(key: K) => (m: Map<K, V>) => m.has(key);
    const size = <K, V>(m: Map<K, V>) => m.size;

    const set = <K, V>(key: K, value: V) => (m: Map<K, V>) => {
        const copy = new Map(m);
        copy.set(key, value);
        return copy;
    }

    return {
        ...functor<$<KMap, I>>({ map }),
        ...monoid<$<KMap, I>>({ empty, append }),
        delete: _delete,
        get,
        getMaybe,
        has,
        set,
        size
    };
}
