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
    rebuild<A, B>(fa: Record<string, A>, f: (a: A, k: string) => [B, string]): Record<string, B>
}

export const object: IObject = (() => {
    const rebuild = <A, B>(fa: Record<string, A>, f: (a: A, k: string) => [B, string]): Record<string, B> => {
        const result: Record<string, B> = {};

        for (const key in fa) {
            const [value, newKey] = f(fa[key], key);
            result[newKey] = value;
        }

        return result;
    };

    const map = <A, B>(fa: Record<string, A>, f: (a: A) => B): Record<string, B> => rebuild(fa, (a, k) => [f(a), k]);
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
