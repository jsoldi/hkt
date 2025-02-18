import { KRoot, $, $B } from "../core/hkt.js"
import { IMonad, monad } from "../classes/monad.js"
import { ITransformer, monadTrans } from "../classes/transformer.js"
import { id } from "../core/utils.js"

export type Reader<in E, out R> = (a: E) => R

export interface KReader<E> extends KRoot {
    readonly 0: unknown
    readonly body: Reader<E, this[0]>
}

export type KReaderTrans<E> = $<$B, KReader<E>>

export interface IReader<E> extends IMonad<KReader<E>>, ITransformer<KReaderTrans<E>> {
    ask: Reader<E, E>
    local: <A>(f: (e: E) => E) => (m: Reader<E, A>) => Reader<E, A>
    reader: <A>(f: (e: E) => A) => Reader<E, A>
    of: <T>() => IReader<T>
}

function readerOf<E>(): IReader<E> {
    const ask: Reader<E, E> = id;
    const local = (f: (e: E) => E) => <A>(m: Reader<E, A>): Reader<E, A> => e => m(f(e));
    const _reader: <A>(f: (e: E) => A) => Reader<E, A> = id;
    const of = <T>() => readerOf<T>();

    const transform = <M>(inner: IMonad<M>) => {
        type KType = $<KReaderTrans<E>, M>;

        return monadTrans<KReaderTrans<E>, M>({
            map: (fa, f) => e => inner.map(fa(e), f),
            unit: <A>(a: A) => _ => inner.unit(a),
            bind: <A, B>(fa: $<KType, A>, f: (a: A) => $<KType, B>) => e => inner.bind(fa(e), a => f(a)(e)),
            lift: <A>(a: $<M, A>): Reader<E, $<M, A>> => _ => a,
            wrap: r => e => inner.unit(r(e))
        });
    };

    return {
        ...monad<KReader<E>>({
            map: (fa, f) => e => f(fa(e)),
            unit: <A>(a: A) => (_: E) => a,
            bind: <A, B>(fa: Reader<E, A>, f: (a: A) => Reader<E, B>) => (e: E) => f(fa(e))(e)
        }),
        ask,
        local,
        reader: _reader,
        of,
        transform
    }
}

export const reader = readerOf<any>();
