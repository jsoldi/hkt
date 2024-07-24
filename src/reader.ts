import { functor } from "./functor.js"
import { KRoot, KApp } from "./hkt.js"
import { IMonad, monad } from "./monad.js"
import { KTransOut, ITransformer, monadTrans } from "./transformer.js"
import { id } from "./utils.js"

export type Reader<E, R> = (a: E) => R

export interface KReader extends KRoot {
    readonly 0: unknown
    readonly 1: unknown
    readonly body: Reader<this[0], this[1]>
}

export type KReaderTrans<E> = KTransOut<KApp<KReader, E>>

export interface IReader<E> extends IMonad<KApp<KReader, E>>, ITransformer<KReaderTrans<E>> {
    ask: Reader<E, E>
    local: <A>(f: (e: E) => E) => (m: Reader<E, A>) => Reader<E, A>
    reader: <A>(f: (e: E) => A) => Reader<E, A>
}

export function reader<E>(): IReader<E> {
    const m = monad<KApp<KReader, E>>({
        ...functor<KApp<KReader, E>>({
            map: (fa, f) => e => f(fa(e))
        }),
        unit: <A>(a: A) => (_: E) => a,
        bind: <A, B>(fa: Reader<E, A>, f: (a: A) => Reader<E, B>) => (e: E) => f(fa(e))(e)
    });

    const ask: Reader<E, E> = id;
    const local = (f: (e: E) => E) => <A>(m: Reader<E, A>): Reader<E, A> => e => m(f(e));
    const reader: <A>(f: (e: E) => A) => Reader<E, A> = id;

    const transform = <M>(inner: IMonad<M>) => {
        type KType = KApp<KReaderTrans<E>, M>;

        return monadTrans<KReaderTrans<E>, M>({
            ...monad({
                ...functor<KType>({
                    map: (fa, f) => e => inner.map(fa(e), f)
                }),
                unit: <A>(a: A) => _ => inner.unit(a),
                bind: <A, B>(fa: KApp<KType, A>, f: (a: A) => KApp<KType, B>) => e => inner.bind(fa(e), a => f(a)(e)),
            }),
            lift: <A>(a: KApp<M, A>): Reader<E, KApp<M, A>> => _ => a
        });
    };

    return {
        ...m,
        ask,
        local,
        reader,
        transform
    }
}
