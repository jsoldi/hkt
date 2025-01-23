import { functor, IFunctor } from "./functor.js";
import { $, $3, $B, KRoot } from "./hkt.js";
import { IMonoid, monoid } from "./monoid.js";

type K = keyof any;

export interface KObject extends KRoot {
    readonly 0: unknown
    readonly body: Record<K, this[0]>
}

interface IObject extends IFunctor<KObject>, IMonoid<KObject> {
    entries<A>(fa: Record<K, A>): [K, A][]
    keys<A>(fa: Record<K, A>): K[]
    values<A>(fa: Record<K, A>): A[]
    rebuild<T extends Record<K, any>, B>(fa: T, f: (a: T[keyof T], k: K) => [B, K]): { [K in keyof T]: B }
    monoid<M>(m: IMonoid<M>): IMonoid<$3<$B, KObject, M>>
    map<T extends Record<K, any>, R>(obj: T, f: (a: T[keyof T], k: K) => R): { [K in keyof T]: R }
    map<A, B>(fa: Record<K, A>, f: (a: A, k: K) => B): Record<K, B>
    fmap<T extends Record<K, any>, B>(f: (a: T[keyof T]) => B): (fa: T) => { [K in keyof T]: B }
    fmap<T extends Record<K, any>, B, C>(f: (a: T[keyof T]) => B, g: (b: B) => C): (fa: T) => { [K in keyof T]: C }
    fmap<T extends Record<K, any>, B, C, D>(f: (a: T[keyof T]) => B, g: (b: B) => C, h: (c: C) => D): (fa: T) => { [K in keyof T]: D }
    setDefault<T>(def: T): (record: Record<K, T>) => Record<K, T>
}

export const object: IObject = (() => {
    const rebuild = <T extends Record<K, any>, B>(fa: T, f: (a: T[keyof T], k: K) => [B, K]): { [K in keyof T]: B } => {
        const result: Record<K, B> = {};

        for (const key in fa) {
            const [value, newKey] = f(fa[key], key);
            result[newKey] = value;
        }

        return result as { [K in keyof T]: B };
    };

    const map: {
        <T extends Record<K, any>, R>(obj: T, f: (a: T[keyof T], k: K) => R): { [K in keyof T]: R }
        <A, B>(fa: Record<K, A>, f: (a: A, k: K) => B): Record<K, B>
    } = <A, B>(fa: Record<K, A>, f: (a: A, k: K) => B): Record<K, B> => rebuild(fa, (a, k) => [f(a, k), k] as const);

    const empty = <A>(): Record<K, A> => ({} as Record<K, A>);
    const append = <A>(fa: Record<K, A>, fb: Record<K, A>): Record<K, A> => ({ ...fa, ...fb });
    const entries = <A>(fa: Record<K, A>): [K, A][] => Object.entries(fa);
    const keys = <A>(fa: Record<K, A>): K[] => Object.keys(fa);
    const values = <A>(fa: Record<K, A>): A[] => Object.values(fa);

    const setDefault = <T>(def: T) => (record: Record<keyof any, T>): Record<keyof any, T> => new Proxy(record, {
        get(target, prop) {
            if (prop in target) 
                return target[prop];
            
            return def;
        }
    });

    const _monoid = <M>(m: IMonoid<M>) => monoid<$3<$B, KObject, M>>({
        empty: () => ({}),
        append: <A>(fa: Record<K, $<M, A>>, fb: Record<K, $<M, A>>) => {
            const result = { ...fa };
    
            for (const k in fb) 
                result[k] = k in fa ? m.append(fa[k], fb[k]) : fb[k];
    
            return setDefault<$<M, A>>(m.empty())(result);
        }
    });

    return {
        entries,
        keys,
        values,
        rebuild,
        setDefault,
        monoid: _monoid,
        ...functor<KObject>({ map }),
        ...monoid<KObject>({ empty, append }),
        map
    };
})();
