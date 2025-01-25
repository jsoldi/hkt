import { KRoot } from "./hkt.js"
import { Maybe } from "./maybe.js"
import { IMonad, monad } from "./monad.js"
import { fold, IFold } from "./fold.js"
import { IMonadPlus, monadPlus } from "./monadPlus.js"
import { monoid } from "./monoid.js"
import { KPromise, promise } from "./promise.js"

export type AsyncGen<T> = AsyncGenerator<T, void, void>
export type SyncGen<T> = Generator<T, void, void>

export type Async<T> = () => AsyncGen<T>
export type Sync<T> = () => SyncGen<T>

export type Awaitable<T> = T | Promise<T>

export type AsyncLike<T> = Async<T> | Sync<T> | Awaitable<T[]>
export type GenLike<T> = AsyncLike<T> | AsyncGen<T> | SyncGen<T>

export interface KAsync extends KRoot {
    readonly 0: unknown
    readonly body: Async<this[0]>
}

export interface IAsync extends IMonadPlus<KAsync>, IFold<KAsync, KPromise> {
    readonly scalar: IMonad<KPromise>
    from<A>(asyncLike: AsyncLike<A>): Async<A>
    bind<A, B>(fa: Async<A>, f: (a: A) => GenLike<B>): Async<B>
    flat<T>(gen: Async<Async<T>>): Async<T>
    take(n: number): <T>(fa: Async<T>) => Async<T>
    forEach<T>(f: (a: T) => void): (fa: Async<T>) => Async<T>
    toArray<T>(fa: Async<T>): Promise<T[]>
    filter<T, S extends T>(pred: (a: T) => a is S): (fa: Async<T>) => Async<S>
    filter<T>(pred: (a: T) => unknown): (fa: Async<T>) => Async<T>
    takeWhile<T>(pred: (a: T) => unknown): (fa: Async<T>) => Async<T>
    skipWhile<T>(pred: (a: T) => unknown): (fa: Async<T>) => Async<T>
    distinctBy<T, K>(key: (a: T) => K): (fa: Async<T>) => Async<T>
    distinct<T>(fa: Async<T>): Async<T>
    chunks<T>(size: number): (fa: Async<T>) => Async<T[]>
    reduce<T, U>(acc: U, f: (acc: U, a: T) => U): (fa: Async<T>) => Promise<U>
    unfoldr<A, B>(f: (b: B) => Awaitable<Maybe<[A, B]>>): (b: B) => Async<A>
}

export const async: IAsync = (() => {
    type I = IAsync;

    const gen = async function* <T>(gen: GenLike<T>) {
        yield* await (typeof gen === 'function' ? gen() : gen);
    }

    const unit: I['unit'] = a => async function* () { yield a; }

    const bind: I['bind'] = (fa, f) => async function* () {
        for await (const a of fa()) {
            for await (const b of gen(f(a)))
                yield b;            
        }
    }

    const map: I['map'] = (fa, f) => async function* () {
        for await (const a of fa())
            yield f(a);
    }

    const from = <A>(asyncLike: AsyncLike<A>): Async<A> => async function* () {
        for await (const a of gen(asyncLike))
            yield a;
    }

    const flat: I['flat'] = gen => async function* () {
        for await (const a of gen())
            yield* a();
    }

    const take: I['take'] = n => fa => async function* () {
        for await (const a of fa()) {
            if (n-- <= 0)
                break;

            yield a
        }
    }

    const forEach: I['forEach'] = f => fa => async function* () {
        for await (const a of fa()) {
            f(a);
            yield a;
        }
    }

    const toArray: I['toArray'] = async <T>(fa: Async<T>) => {
        const result: T[] = [];

        for await (const a of fa())
            result.push(a);

        return result;
    }

    const filter: I['filter'] = <T>(pred: (a: T) => unknown) => (fa: Async<T>) => async function* () {
        for await (const a of fa()) {
            if (pred(a))
                yield a;
        }
    }

    const takeWhile: I['takeWhile'] = pred => fa => async function* () {
        for await (const a of fa()) {
            if (!await pred(a))
                break;

            yield a;
        }
    }

    const skipWhile: I['skipWhile'] = pred => fa => async function* () {
        let skip = true;

        for await (const a of fa()) {
            if (skip && !await pred(a))
                skip = false;

            if (!skip)
                yield a;
        }
    }

    const distinctBy: I['distinctBy'] = <T, K>(key: (a: T) => K) => (fa: Async<T>) => async function* () {
        const keys = new Set<K>();

        for await (const a of fa()) {
            const k = key(a);

            if (!keys.has(k)) {
                keys.add(k);
                yield a;
            }
        }
    }

    const distinct: I['distinct'] = <T>(fa: Async<T>) => distinctBy<T, T>(a => a)(fa);

    const chunks = <T>(size: number) => (fa: Async<T>) => async function* (): AsyncGen<T[]> {
        let chunk: T[] = [];

        for await (const a of fa()) {
            chunk.push(a);

            if (chunk.length === size) {
                yield chunk;
                chunk = [];
            }
        }

        if (chunk.length > 0)
            yield chunk;
    }

    const reduce: I['reduce'] = (init, f) => async fa => {
        // Can't directly modify init because it'd modify it for all passed generators
        let acc = init;

        for await (const a of fa())
            acc = f(acc, a);

        return acc;
    }

    const empty: I['empty'] = () => async function* () { };

    const append: I['append'] = (fa, fb) => async function* () {
        yield* fa();
        yield* fb();
    }

    const unfoldr: I['unfoldr'] = <A, B>(f: (b: B) => Awaitable<Maybe<[A, B]>>) => (b: B) => async function* () {
        let next = await f(b);

        while (next.right) {
            let a: A;
            [a, b] = next.value;
            yield a;
            next = await f(b);
        }
    };

    const foldl = <A, B>(f: (b: B, a: A) => B) => (b: B) => reduce(b, f);
    const wrap = <T>(prom: Promise<T>) => async function* () { yield await prom; }
    const scalar = promise;

    const _monadFold = monadPlus<KAsync>({
        ...monad<KAsync>({
            map,
            unit,
            bind,
        }),
        ...monoid<KAsync>({
            empty,
            append
        }),
    });

    return {
        ...fold<KAsync, KPromise>({
            unit,
            bind,
            map,
            foldl,
            wrap,
            scalar
        }),
        scalar,
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
    }
})();
