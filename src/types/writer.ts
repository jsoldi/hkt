import { $, $K, KRoot } from "../core/hkt.js";
import { IMonad, monad } from "../classes/monad.js";
import { IMonoid } from "../classes/monoid.js";
import { ITransformer, monadTrans } from "../classes/transformer.js";

/** The writer monad value type. */
export type Writer<W, A> = [A, W];

/** The writer monad transformer value type, represented as an inner monad carrying a writer value. */
export type WriterTrans<F, W, A> = $<F, Writer<W, A>>;

/** Higher-kinded type of the writer monad. */
export interface KWriter<W> extends KRoot {
    readonly 0: unknown
    readonly body: Writer<W, this[0]>
}

/** Higher-kinded type of the writer monad transformer. */
export interface KWriterTrans<W> extends KRoot {
    readonly 0: unknown
    readonly 1: unknown
    readonly body: WriterTrans<this[0], W, this[1]>
}

/** The writer interface, providing writer computations with a fixed output type. */
export interface IWriter<W> extends IMonad<KWriter<W>>, ITransformer<KWriterTrans<W>> {
    /** Creates a writer with an explicit value and output. */
    writer<A>(a: A, w: W): Writer<W, A>
    /** Appends output without changing the value. */
    tell(w: W): Writer<W, null>
    /** Returns both the value and current output as the value. */
    listen<A>(fa: Writer<W, A>): Writer<W, [A, W]>
    /** Transforms the output value of a writer computation. */
    censor(f: (w: W) => W): <A>(fa: Writer<W, A>) => Writer<W, A>
    /** Returns the value carried by the writer computation. */
    value<A>(fa: Writer<W, A>): A
    /** Returns the output carried by the writer computation. */
    output<A>(fa: Writer<W, A>): W
    /** Creates a writer module with a fixed output type. */
    of<T>(monoid: IMonoid<$<$K, T>>): IWriter<T>
}

/** The writer module factory, producing writer modules from a monoid instance. */
export interface IWriterFactory {
    /** Creates a writer module for the given output monoid. */
    <W>(monoid: IMonoid<$<$K, W>>): IWriter<W>
    /** Creates a writer module for the given output monoid. */
    of<W>(monoid: IMonoid<$<$K, W>>): IWriter<W>
}

/** Creates a writer monad with a fixed output type and monoid. */
function writerOf<W>(wMonoid: IMonoid<$<$K, W>>): IWriter<W> {
    const writer = <A>(a: A, w: W): Writer<W, A> => [a, w];
    const unit = <A>(a: A): Writer<W, A> => [a, wMonoid.empty<W>()];

    const bind = <A, B>(fa: Writer<W, A>, f: (a: A) => Writer<W, B>): Writer<W, B> => {
        const [a, w1] = fa;
        const [b, w2] = f(a);
        return [b, wMonoid.append(w1, w2)];
    };

    const tell = (w: W): Writer<W, null> => [null, w];
    const listen = <A>(fa: Writer<W, A>): Writer<W, [A, W]> => {
        const [a, w] = fa;
        return [[a, w], w];
    };
    const censor = (f: (w: W) => W) => <A>(fa: Writer<W, A>): Writer<W, A> => {
        const [a, w] = fa;
        return [a, f(w)];
    };
    const value = <A>(fa: Writer<W, A>): A => fa[0];
    const output = <A>(fa: Writer<W, A>): W => fa[1];
    const of = <T>(monoid: IMonoid<$<$K, T>>) => writerOf<T>(monoid);

    const transform = <M>(inner: IMonad<M>) => {
        const unit = <A>(a: A): WriterTrans<M, W, A> => inner.unit([a, wMonoid.empty<W>()]);

        const bind = <A, B>(
            fa: WriterTrans<M, W, A>,
            f: (a: A) => WriterTrans<M, W, B>
        ): WriterTrans<M, W, B> => inner.bind(fa, ([a, w1]) =>
            inner.map(f(a), ([b, w2]) => [b, wMonoid.append(w1, w2)])
        );

        const lift = <A>(ma: $<M, A>): WriterTrans<M, W, A> =>
            inner.map(ma, a => [a, wMonoid.empty<W>()]);

        const wrap = <A>(wa: Writer<W, A>): WriterTrans<M, W, A> => inner.unit(wa);

        return monadTrans<KWriterTrans<W>, M>({ unit, bind, lift, wrap });
    };

    return {
        ...monad<KWriter<W>>({ unit, bind }),
        writer,
        tell,
        listen,
        censor,
        value,
        output,
        of,
        transform,
    };
}

const _writer = (<W>(monoid: IMonoid<$<$K, W>>) => writerOf<W>(monoid)) as IWriterFactory;
_writer.of = writerOf;

/** The `writer` module factory. */
export const writer: IWriterFactory = _writer;
