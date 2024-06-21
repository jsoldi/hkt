import { KApp, KRoot, SetNextArgument } from "./hkt.js";
import { IMonad, IMonadBase, monad } from "./monad.js";
import { ITransMonad } from "./transform.js";

export interface KArray extends KRoot {
    readonly 0: unknown
    readonly body: Array<this[0]>
}

export interface KArrayTransform extends KRoot {
    readonly 0: unknown
    readonly 1: unknown
    readonly body: KApp<this[0], Array<this[1]>>
}

type Inside = SetNextArgument<KArrayTransform, string>;

type Hola = SetNextArgument<SetNextArgument<KArrayTransform, string>, number>;

export const array: ITransMonad<KArray, KArrayTransform> = (() => {
    const m = monad<KArray>({ 
        unit: a => [a], 
        bind: (fa, f) => fa.flatMap(f) 
    });

    const transform = <F>(outer: IMonad<F>) => {
        const lift = <A>(a: KApp<F, A>): KApp<F, Array<A>> => outer.map(a, m.unit);

        const mt = monad<KApp<KArrayTransform, F>>({
            unit: <A>(a: A): KApp<F, Array<A>> => outer.unit(m.unit(a)),
            bind: <A, B>(fa: KApp<F, Array<A>>, f: (a: A) => KApp<F, Array<B>>): KApp<F, Array<B>> =>
                outer.bind(fa, ae => outer.map(outer.sequence(ae.map(f)), a => a.flat()))
        }); 

        return { ...mt, lift };
    }

    return { ...m, transform };
})();
