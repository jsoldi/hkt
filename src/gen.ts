import { KRoot } from "./hkt.js"
import { IMonadPlus, monadPlus } from "./monadPlus.js"

export type Gen<T> = AsyncGenerator<T, void, void>

export interface KGen extends KRoot {
    readonly 0: unknown
    readonly body: Gen<this[0]>
}

export interface IGen extends IMonadPlus<KGen> {
    from: <T>(genlike: (() => Gen<T>) | T[] | Promise<T> | Gen<T>) => Gen<T>
    flat: <T>(gen: Gen<Gen<T>>) => Gen<T>
    take: (n: number) => <T>(fa: Gen<T>) => Gen<T>
    forEach: <T>(f: (a: T) => void) => (fa: Gen<T>) => Gen<T>
    toArray: <T>(fa: Gen<T>) => Promise<T[]>
    filter: {
        <T, S extends T>(pred: (a: T) => a is S): (fa: Gen<T>) => Gen<S>
        <T>(pred: (a: T) => unknown): (fa: Gen<T>) => Gen<T>
    }
    takeWhile: <T>(pred: (a: T) => unknown) => (fa: Gen<T>) => Gen<T>
    skipWhile: <T>(pred: (a: T) => unknown) => (fa: Gen<T>) => Gen<T>
    distinctBy: <T, K>(key: (a: T) => K) => (fa: Gen<T>) => Gen<T>
    distinct: <T>(fa: Gen<T>) => Gen<T>
    chunks: <T>(size: number) => (fa: Gen<T>) => Gen<T[]>
    reduce: <T, U>(acc: U, f: (acc: U, a: T) => U) => (fa: Gen<T>) => Promise<U>
}

export const gen: IGen = (() => {
    async function* unit<T>(a: T): Gen<T> {
        yield a
    }

    async function* bind<T, U>(fa: Gen<T>, f: (a: T) => Gen<U>): Gen<U> {
        for await (const a of fa) {
            yield* f(a)
        }
    }

    async function* from<T>(genlike: (() => Gen<T>) | T[] | Promise<T> | Gen<T>): Gen<T> {
        if (genlike instanceof Function) {
            yield* genlike()
        } else if (genlike instanceof Array) {
            for (const a of genlike)
                yield a
        } else if (genlike instanceof Promise) {
            yield await genlike
        } else {
            yield* genlike
        }
    }

    const flat = <T>(gen: Gen<Gen<T>>): Gen<T> => bind(gen, a => a);

    const take = (n: number) => async function* <T>(fa: Gen<T>): Gen<T> {
        for await (const a of fa) {
            if (n-- <= 0)
                break;

            yield a
        }
    }

    const forEach = <T>(f: (a: T) => void) => async function* (fa: Gen<T>): Gen<T> {
        for await (const a of fa) {
            f(a);
            yield a;
        }
    }

    const toArray = async <T>(fa: Gen<T>): Promise<T[]> => {
        const result: T[] = [];

        for await (const a of fa)
            result.push(a);

        return result;
    }

    const filter: {
        <T, S extends T>(pred: (a: T) => a is S): (fa: Gen<T>) => Gen<S>
        <T>(pred: (a: T) => unknown): (fa: Gen<T>) => Gen<T>
    } = <T>(pred: (a: T) => unknown): (fa: Gen<T>) => Gen<T> => async function* (fa) {
        for await (const a of fa) {
            if (pred(a))
                yield a;
        }
    }

    const takeWhile = <T>(pred: (a: T) => unknown) => async function* (fa: Gen<T>): Gen<T> {
        for await (const a of fa) {
            if (!await pred(a))
                break;

            yield a;
        }
    }

    const skipWhile = <T>(pred: (a: T) => unknown) => async function* (fa: Gen<T>): Gen<T> {
        let skip = true;

        for await (const a of fa) {
            if (skip && !await pred(a))
                skip = false;

            if (!skip)
                yield a;
        }
    }

    const distinctBy = <T, K>(key: (a: T) => K) => async function* (fa: Gen<T>): Gen<T> {
        const keys = new Set<K>();

        for await (const a of fa) {
            const k = key(a);

            if (!keys.has(k)) {
                keys.add(k);
                yield a;
            }
        }
    }

    const distinct = <T>(fa: Gen<T>): Gen<T> => distinctBy<T, T>(a => a)(fa);

    const chunks = <T>(size: number) => async function* (fa: Gen<T>): Gen<T[]> {
        let chunk: T[] = [];

        for await (const a of fa) {
            chunk.push(a);

            if (chunk.length === size) {
                yield chunk;
                chunk = [];
            }
        }

        if (chunk.length > 0)
            yield chunk;
    }

    const reduce = <T, U>(acc: U, f: (acc: U, a: T) => U) => async function(fa: Gen<T>): Promise<U> {
        for await (const a of fa)
            acc = f(acc, a);

        return acc;
    }

    const empty = () => (async function*() {})();

    const concat: <A>(fa: Gen<A>, fb: Gen<A>) => Gen<A> = async function*(fa, fb) {
        yield* fa;
        yield* fb;
    }

    const m = monadPlus<KGen>({
        unit,
        bind,
        empty,
        concat
    });

    return {
        ...m,
        from,
        take,
        flat,
        forEach,
        toArray,
        filter,
        takeWhile,
        skipWhile,
        distinctBy,
        distinct,
        chunks,
        reduce
    }
})();
