import { functor, IFunctor } from "./functor.js";
import { KRoot } from "./hkt.js";
import { IMonoid, monoid } from "./monoid.js";

export interface KObject extends KRoot {
    readonly 0: unknown
    readonly body: Record<string, this[0]>
}

interface IObject extends IFunctor<KObject>, IMonoid<KObject> {
    entries<A>(fa: Record<string, A>): [string, A][]
    keys<A>(fa: Record<string, A>): string[]
    values<A>(fa: Record<string, A>): A[]
    rebuild<T extends Record<string, any>, B>(fa: T, f: (a: T[keyof T], k: string) => [B, string]): { [K in keyof T]: B }
    map<T extends Record<string, any>, R>(obj: T, f: (a: T[keyof T]) => R): { [K in keyof T]: R }
    map<A, B>(fa: Record<string, A>, f: (a: A) => B): Record<string, B>
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
        <T extends Record<string, any>, R>(obj: T, f: (a: T[keyof T]) => R): { [K in keyof T]: R }
        <A, B>(fa: Record<string, A>, f: (a: A) => B): Record<string, B>
    } = <A, B>(fa: Record<string, A>, f: (a: A) => B): Record<string, B> => rebuild(fa, (a, k) => [f(a), k]);

    const empty = <A>(): Record<string, A> => ({} as Record<string, A>);
    const append = <A>(fa: Record<string, A>, fb: Record<string, A>): Record<string, A> => ({ ...fa, ...fb });
    const entries = <A>(fa: Record<string, A>): [string, A][] => Object.entries(fa);
    const keys = <A>(fa: Record<string, A>): string[] => Object.keys(fa);
    const values = <A>(fa: Record<string, A>): A[] => Object.values(fa);

    return {
        entries,
        keys,
        values,
        rebuild,
        ...functor<KObject>({ map }),
        ...monoid<KObject>({ empty, append })
    };
})();
