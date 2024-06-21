import { KApp, KRoot } from "./hkt.js";

interface ITypeClass<F> {
    // readonly _classParam?: (f: F) => void
    readonly _classParam?: F
}

interface IMonadBase<F> extends ITypeClass<F> {
    unit<A>(a: A): KApp<F, A>
}

interface ITransform<F, T> extends IMonadBase<KApp<T, F>> {
    readonly lift: <A>(a: KApp<F, A>) => KApp<KApp<T, F>, A>
}

interface KArrayTransform extends KRoot {
    readonly 0: unknown
    readonly 1: unknown
    readonly body: KApp<this[0], Array<this[1]>>
}

interface TTrivial extends KRoot {
    readonly 0: unknown
    readonly body: this[0]
}

declare const fun: <K>(outer: IMonadBase<K>) => ITransform<K, KArrayTransform>

interface Derived extends IMonadBase<TTrivial> { }

declare const trivial: Derived

async function main() {
    var lel = fun(trivial);
}

main();
