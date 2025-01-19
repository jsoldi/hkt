import { functor, IFunctor } from "./functor.js";
import { $, $K, KRoot } from "./hkt.js";
import { IMonoid, monoid, monoidFor } from "./monoid.js";

export interface KObject extends KRoot {
    readonly 0: unknown
    readonly body: Record<string, this[0]>
}

interface IObject extends IFunctor<KObject>, IMonoid<KObject> {
    entries<A>(fa: Record<string, A>): [string, A][]
    keys<A>(fa: Record<string, A>): string[]
    values<A>(fa: Record<string, A>): A[]
    rebuild<T extends Record<string, any>, B>(fa: T, f: (a: T[keyof T], k: string) => [B, string]): { [K in keyof T]: B }
    monoid<A>(sum: (l: A, r: A) => A): IMonoid<$<$K, Record<string, A>>>
    map<T extends Record<string, any>, R>(obj: T, f: (a: T[keyof T], k: string) => R): { [K in keyof T]: R }
    map<A, B>(fa: Record<string, A>, f: (a: A, k: string) => B): Record<string, B>
    fmap<T extends Record<string, any>, B>(f: (a: T[keyof T]) => B): (fa: T) => { [K in keyof T]: B }
    fmap<T extends Record<string, any>, B, C>(f: (a: T[keyof T]) => B, g: (b: B) => C): (fa: T) => { [K in keyof T]: C }
    fmap<T extends Record<string, any>, B, C, D>(f: (a: T[keyof T]) => B, g: (b: B) => C, h: (c: C) => D): (fa: T) => { [K in keyof T]: D }
}

export const object: IObject = (() => {
    const rebuild = <T extends Record<string, any>, B>(fa: T, f: (a: T[keyof T], k: string) => [B, string]): { [K in keyof T]: B } => {
        const result: Record<string, B> = {};

        for (const key in fa) {
            const [value, newKey] = f(fa[key], key);
            result[newKey] = value;
        }

        return result as { [K in keyof T]: B };
    };

    const map: {
        <T extends Record<string, any>, R>(obj: T, f: (a: T[keyof T], k: string) => R): { [K in keyof T]: R }
        <A, B>(fa: Record<string, A>, f: (a: A, k: string) => B): Record<string, B>
    } = <A, B>(fa: Record<string, A>, f: (a: A, k: string) => B): Record<string, B> => rebuild(fa, (a, k) => [f(a, k), k] as const);

    const empty = <A>(): Record<string, A> => ({} as Record<string, A>);
    const append = <A>(fa: Record<string, A>, fb: Record<string, A>): Record<string, A> => ({ ...fa, ...fb });
    const entries = <A>(fa: Record<string, A>): [string, A][] => Object.entries(fa);
    const keys = <A>(fa: Record<string, A>): string[] => Object.keys(fa);
    const values = <A>(fa: Record<string, A>): A[] => Object.values(fa);

    const _monoid = <A>(sum: (l: A, r: A) => A) => monoidFor<Record<string, A>>({}, (fa, fb) => {
            const result = { ...fa };
    
            for (const k in fb) {
                result[k] = k in fa ? sum(fa[k], fb[k]) : fb[k];
            }
    
            return result;
        }        
    );

    return {
        entries,
        keys,
        values,
        rebuild,
        monoid: _monoid,
        ...functor<KObject>({ map }),
        ...monoid<KObject>({ empty, append }),
        map
    };
})();
