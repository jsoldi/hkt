import { KRoot } from "./hkt.js"
import { Maybe } from "./maybe.js"
import { IMonad, monad } from "./monad.js"
import { fold, IFold } from "./fold.js"
import { IMonadPlus, monadPlus } from "./monadPlus.js"
import { monoid } from "./monoid.js"
import { KPromise, promise } from "./promise.js"

export type Gen<T> = AsyncGenerator<T, void, void>

export interface KGen extends KRoot {
    readonly 0: unknown
    readonly body: Gen<this[0]>
}

type Awaitable<T> = T | Promise<T>
type GenLike<T> = (() => GenLike<T>) | T[] | Promise<T>

export interface IGen extends IMonadPlus<KGen>, IFold<KGen, KPromise> {
    readonly scalar: IMonad<KPromise>
    from: <T>(genlike: GenLike<T>) => Gen<T>
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
    unfoldr: <A, B>(f: (b: B) => Awaitable<Maybe<[A, B]>>) => (b: B) => Gen<A>
    flatMapFrom: <A, B>(f: (a: A) => GenLike<B>) => (fa: Gen<A>) => Gen<B>
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

    async function* map<T, U>(fa: Gen<T>, f: (a: T) => U): Gen<U> {
        for await (const a of fa) {
            yield f(a)
        }
    }

    async function* from<T>(genlike: GenLike<T>): Gen<T> {
        if (genlike instanceof Function) {
            yield* from(genlike());
        } else if (genlike instanceof Array) {
            for (const a of genlike)
                yield a
        } else {
            yield await genlike
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

    const reduce = <T, U>(init: U, f: (acc: U, a: T) => U) => async function(fa: Gen<T>): Promise<U> {
        // Can't directly modify init because it'd modify it for all passed generators
        let acc = init; 

        for await (const a of fa)
            acc = f(acc, a);

        return acc;
    }

    const empty = () => (async function*() {})();

    const append: <A>(fa: Gen<A>, fb: Gen<A>) => Gen<A> = async function*(fa, fb) {
        yield* fa;
        yield* fb;
    }
        
    const unfoldr = <A, B>(f: (b: B) => Awaitable<Maybe<[A, B]>>) => async function*(b: B): Gen<A> {
        let next = await f(b);

        while (next.right) {
            let a: A;
            [a, b] = next.value;
            yield a;
            next = await f(b);
        }
    };

    const flatMapFrom = <A, B>(f: (a: A) => GenLike<B>) => (gen: Gen<A>): Gen<B> => bind(gen, a => from(f(a)));

    const _monadFold = monadPlus<KGen>({
        ...monad<KGen>({
            map,
            unit,
            bind,
        }),
        ...monoid<KGen>({
            empty,
            append
        }),
    });

    return {
        ...fold<KGen, KPromise>({
            map,
            foldl: f => i => reduce(i, f),
            wrap: from,
            scalar: promise
        }),
        scalar: promise,
        ..._monadFold,
        from, // override MonadPlus implementation
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
        reduce,
        unfoldr,
        flatMapFrom
    }
})();
