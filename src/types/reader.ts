import { KRoot, $, $B } from "../core/hkt.js"
import { IMonad, monad } from "../classes/monad.js"
import { ITransformer, monadTrans } from "../classes/transformer.js"
import { id } from "../core/utils.js"

/** Alias for a reader function. */
export type Reader<in E, out R> = (a: E) => R

/** Higher-kinded type for reader functions. */
export interface KReader<E> extends KRoot {
    readonly 0: unknown
    readonly body: Reader<E, this[0]>
}

/** The reader monad transformer type. */
export type KReaderTrans<E> = $<$B, KReader<E>>

/** The reader interface with fixed environment type, providing a set of functions for working with reader functions. */
export interface IReader<E> extends IMonad<KReader<E>>, ITransformer<KReaderTrans<E>> {
    /** Returns a reader that returns the environment. */
    readonly ask: Reader<E, E>
    /** Applies a function to the environment. */
    local<A>(f: (e: E) => E): (m: Reader<E, A>) => Reader<E, A>
    /** Creates a reader from a function. */
    reader<A>(f: (e: E) => A): Reader<E, A>
    /** Creates a `reader` module with a fixed environment type. */
    of<T>(): IReader<T>
}

/** Creates a reader having a fixed environment type. */
function readerOf<E>(): IReader<E> {
    const ask: Reader<E, E> = id;
    const local = (f: (e: E) => E) => <A>(m: Reader<E, A>): Reader<E, A> => e => m(f(e));
    const _reader: <A>(f: (e: E) => A) => Reader<E, A> = id;
    const of = <T>() => readerOf<T>();

    const transform = <M>(inner: IMonad<M>) => {
        type ReaderTrams<E, M, A> = Reader<E, $<M, A>>

        return monadTrans<KReaderTrans<E>, M>({
            map: (fa, f) => e => inner.map(fa(e), f),
            unit: <A>(a: A) => _ => inner.unit(a),
            bind: <A, B>(fa: ReaderTrams<E, M, A>, f: (a: A) => ReaderTrams<E, M, B>) => e => inner.bind(fa(e), a => f(a)(e)),
            lift: <A>(a: $<M, A>): ReaderTrams<E, M, A> => _ => a,
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
        transform,
    }
}

/** The `reader` module, providing a set of functions for working with reader functions. The environment type is fixed to `any`. To change the environment type, call the `of` function. */
export const reader = readerOf<any>();
