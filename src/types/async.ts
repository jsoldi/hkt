import { KRoot } from "../core/hkt.js"
import { IMonad, monad } from "../classes/monad.js"
import { fold, IFold } from "../classes/fold.js"
import { IMonadPlus, monadPlus } from "../classes/monadPlus.js"
import { monoid } from "../classes/monoid.js"
import { IUnfold, unfold } from "../classes/unfold.js"
import { Maybe } from "./maybe.js"
import { KTask, Task, task, TaskLike } from "./task.js"

export type AsyncGen<T> = AsyncGenerator<T, void, void>
export type SyncGen<T> = Generator<T, void, void>
export type Async<T> = () => AsyncGen<T>
export type Sync<T> = () => SyncGen<T>
export type Awaitable<T> = T | Promise<T>

export type AsyncLike<T, A extends any[] = []> =
    T[] |
    Promise<T[]> |
    ((...a: A) => SyncGen<T>) |
    ((...a: A) => AsyncGen<T>) |
    ((...a: A) => AsyncLike<T>) |
    never
;

export interface KAsync extends KRoot {
    readonly 0: unknown
    readonly body: Async<this[0]>
}

export interface IAsync extends IMonadPlus<KAsync>, IFold<KAsync, KTask>, IUnfold<KAsync, KTask> {
    readonly scalar: IMonad<KTask>
    // These tell typescript to preserve the generic type of the function
    fun<T, A extends any[]>(asyncLike: (...a: A) => SyncGen<T>): (...args: A) => Async<T>
    fun<T, A extends any[]>(asyncLike: (...a: A) => AsyncGen<T>): (...args: A) => Async<T>
    fun<T, A extends any[]>(asyncLike: (...a: A) => AsyncLike<T>): (...args: A) => Async<T>
    fun<T, A extends any[]>(asyncLike: AsyncLike<T, A>): (...args: A) => Async<T>
    from<T, A extends any[]>(asyncLike: AsyncLike<T, A>, ...args: A): Async<T>
    bind<A, B>(fa: Async<A>, f: AsyncLike<B, [A]>): Async<B>
    flatMap<A, B>(f: AsyncLike<B, [A]>): (fa: Async<A>) => Async<B>
    unfold<A, B>(alg: (b: B) => TaskLike<Maybe<[A, B]>, [B]>): (b: B) => Async<A>
    take(n: number): <T>(fa: Async<T>) => Async<T>
    toArray<T>(fa: Async<T>): Task<T[]>
    filter<T, S extends T>(pred: (a: T) => a is S): (fa: Async<T>) => Async<S>
    filter<T>(pred: (a: T) => unknown): (fa: Async<T>) => Async<T>
    takeWhile<T>(pred: (a: T) => unknown): (fa: Async<T>) => Async<T>
    skipWhile<T>(pred: (a: T) => unknown): (fa: Async<T>) => Async<T>
    distinctBy<T, K>(key: (a: T) => K): (fa: Async<T>) => Async<T>
    distinct<T>(fa: Async<T>): Async<T>
    chunks<T>(size: number): (fa: Async<T>) => Async<T[]>
    zip<A, B>(fa: Async<A>, fb: Async<B>): Async<[A, B]>
}

export const async: IAsync = (() => {
    type I = IAsync;

    const fun = <T, A extends any[]>(asyncLike: AsyncLike<T, A>) => (...args: A): Async<T> => async function* () {
        const getGen = async <A extends any[]>(al: SyncGen<T> | AsyncGen<T> | AsyncLike<T, A>, ...as: A): Promise<T[] | AsyncGen<T> | SyncGen<T>> => {
            return await (typeof al !== 'function' ? al : getGen(al(...as)));
        }

        for await (const a of await getGen(asyncLike, ...args)) 
            yield a;
    }

    const unit: I['unit'] = a => async function* () { yield a; }

    const bind: I['bind'] = (fa, f) => async function* () {
        for await (const a of fa()) {
            for await (const b of fun(f)(a)())
                yield b;
        }
    }

    const flatMap: I['flatMap'] = f => fa => bind(fa, f);

    const map: I['map'] = (fa, f) => async function* () {
        for await (const a of fa())
            yield f(a);
    }

    const from = <T, A extends any[]>(asyncLike: AsyncLike<T, A>, ...args: A): Async<T> => async function* () {
        for await (const a of fun(asyncLike)(...args)())
            yield a;
    }

    const flat: I['flat'] = fa => async function* () {
        for await (const a of fa())
            yield* a();
    }

    const take: I['take'] = n => fa => async function* () {
        for await (const a of fa()) {
            if (n-- <= 0)
                break;

            yield a
        }
    }

    const toArray: I['toArray'] = <T>(fa: Async<T>) => async () => {
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

    const foldl: I['foldl'] = f => init => fa => async () => {
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

    const _unfold = <A, B>(f: TaskLike<Maybe<[A, B]>, [B]>) => (b: B) => async function* () {
        let next = await task.fun(f)(b)();

        while (next.right) {
            let a: A;
            [a, b] = next.value;
            yield a;
            next = await task.fun(f)(b)();
        }
    };

    const zip = <A, B>(fa: Async<A>, fb: Async<B>): Async<[A, B]> => async function* () {
        const a = fa();
        const b = fb();

        while (true) {
            const [aVal, bVal] = await Promise.all([a.next(), b.next()]);

            if (aVal.done || bVal.done)
                break;

            yield [aVal.value, bVal.value];
        }
    }

    const scalar = task;

    return {
        ...fold<KAsync, KTask>({
            map,
            foldl,
            scalar: scalar
        }),
        ...unfold<KAsync, KTask>({
            map,
            unfold: _unfold,
            scalar: scalar
        }),
        ...monadPlus<KAsync>({
            ...monad<KAsync>({
                map,
                unit,
                bind,
                flatMap,
            }),
            ...monoid<KAsync>({
                empty,
                append
            }),
        }),
        scalar: scalar,
        flatMap,
        fun: fun,
        from, // override MonadPlus implementation
        take,
        flat,
        toArray,
        filter,
        takeWhile,
        skipWhile,
        distinctBy,
        distinct,
        chunks,
        zip,
    }
})();
