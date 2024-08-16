import { KRoot } from "./hkt.js";
import { monadPlus } from "./monadPlus.js";

export type Struct<T> = { readonly [k in string]: T }

export interface KStruct extends KRoot {
    readonly 0: unknown
    readonly body: Struct<this[0]>
}

export const struct = (() => {
    const unit = <A>(value: A): Struct<A> => ({ '': value });

    const bind = <A, B>(fa: Struct<A>, f: (a: A) => Struct<B>): Struct<B> =>
        Object.fromEntries(Object.entries(fa).flatMap(([kl, v]) => 
            Object.entries(f(v)).map(([kr, w]) => [kl + kr, w] as const)
        ));

    const map = <A, B>(fa: Struct<A>, f: (a: A) => B): Struct<B> => {
        return Object.fromEntries(Object.entries(fa).map(([k, v]) => [k, f(v)] as const));
    }

    const empty = <A>(): Struct<A> => ({} as Struct<A>);

    const append = <A>(fa: Struct<A>, fb: Struct<A>): Struct<A> => {
        return { ...fa, ...fb };
    };

    return monadPlus<KStruct>({
        unit,
        bind,
        map,
        empty,
        append,
    });
})();
