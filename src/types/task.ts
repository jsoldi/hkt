import { KRoot } from "../core/hkt.js";
import { IMonad, monad } from "../classes/monad.js";

export type Task<T> = () => Promise<T>;

export interface KTask extends KRoot {
    readonly 0: unknown
    readonly body: Task<this[0]>
}

export type TaskLike<T, A extends any[] = []> = Promise<T> | ((...a: A) => TaskLike<T>);

export interface ITask extends IMonad<KTask> {
    fun<T, A extends any[]>(f: (...a: A) => TaskLike<T>): (...args: A) => Task<T>
    fun<T, A extends any[]>(asyncLike: TaskLike<T, A>): (...args: A) => Task<T>
    bind<A, B>(fa: Task<A>, f: TaskLike<B, [A]>): Task<B>
    flatMap<A, B>(f: TaskLike<B, [A]>): (fa: Task<A>) => Task<B>
    delay(ms: number): Task<void>
    promises<A>(fa: Task<A>[]): Promise<A>[]
    all<A>(fa: Task<A>[]): Task<A[]>
    race<A>(fa: Task<A>[]): Task<A>
    any<A>(fa: Task<A>[]): Task<A>
    memo<A>(f: Task<A>): Task<A>
    abortable(signal: AbortSignal): <A>(fa: Task<A>) => Task<A>
    expirable(ms: number): <A>(fa: Task<A>) => Task<A>
    catch<A, B>(f: (e: unknown) => Task<B>): (fa: Task<A>) => Task<A | B>
    finally<A>(f: () => unknown): (fa: Task<A>) => Task<A>
}

export class AbortError extends Error {
    constructor(msg?: string) {
        super(msg ?? 'Task was aborted');
        this.name = 'AbortError';
    }
}

export const task: ITask = (() => {
    const fun = <T, A extends any[]>(asyncLike: TaskLike<T, A>) => (...args: A): Task<T> => {
        const promiseFun = <T, A extends any[]>(asyncLike: TaskLike<T, A>) => (...args: A): Promise<T> => {
            return typeof asyncLike === 'function' ? promiseFun(asyncLike(...args))() : asyncLike;
        }
    
        return () => promiseFun(asyncLike)(...args);
    }

    const unit = <A>(a: A) => () => Promise.resolve(a);
    const bind = <A, B>(fa: Task<A>, f: TaskLike<B, [A]>) => () => fa().then(a => fun(f)(a)());
    const flatMap = <A, B>(f: TaskLike<B, [A]>) => (fa: Task<A>): Task<B> => bind(fa, f);
    const map = <A, B>(fa: Task<A>, f: (a: A) => B) => () => fa().then(f);
    const delay = (ms: number): Task<void> => () => new Promise(resolve => setTimeout(resolve, ms));
    const promises = <A>(fa: Task<A>[]) => fa.map(t => t());
    const all = <A>(fa: Task<A>[]) => () => Promise.all(promises(fa));
    const race = <A>(fa: Task<A>[]) => () => Promise.race(promises(fa));
    const any = <A>(fa: Task<A>[]) => () => Promise.any(promises(fa));

    const memo = <A>(f: Task<A>) => {
        let memo: Promise<A> | undefined = undefined;

        return () => {
            if (memo === undefined) 
                memo = f();

            return memo;
        }
    };

    const abortable = (signal: AbortSignal) => <A>(fa: Task<A>): Task<A> =>
        () => new Promise((resolve, reject) => {
            const doAbort = () => reject(new AbortError());

            if (signal.aborted)
                return doAbort();

            signal.addEventListener('abort', doAbort);
            fa().then(resolve, reject).finally(() => signal.removeEventListener('abort', doAbort));
        });

    const expirable = (ms: number) => <A>(ta: Task<A>): Task<A> => {
        return () => {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), ms);
            return abortable(controller.signal)(ta)().finally(() => clearTimeout(id));
    
        }
    }
    
    const _catch = <A, B>(f: (e: unknown) => Task<B>) => (fa: Task<A>): Task<A | B> =>
        () => fa().catch(e => f(e)());

    const _finally = <A>(f: () => unknown) => (fa: Task<A>): Task<A> =>
        () => fa().finally(f);

    return {
        ...monad<KTask>({ unit, bind, flatMap, map }),
        delay,
        promises,
        all,
        race,
        any,
        fun,
        memo,
        abortable,
        expirable,
        catch: _catch,
        finally: _finally,
    }
})();
