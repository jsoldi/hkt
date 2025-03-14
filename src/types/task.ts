import { IMonad, monad } from "../classes/monad.js";
import { KRoot } from "../core/hkt.js";
import { pipe } from "../core/utils.js";
import { Free } from "./free/free.js";

/** Alias for a promise-returning function. */
export type Task<T> = () => Promise<T>;

/** Higher-kinded type of the task type — a promise-returning function. */
export interface KTask extends KRoot {
    readonly 0: unknown
    readonly body: Task<this[0]>
}

/** A type that can be converted to a `Task`. */
export type TaskLike<T, A extends any[] = []> = Promise<T> | ((...a: A) => TaskLike<T>);

/** The task interface, providing functions to work with `Task` instances, which are promise-returning functions. */
export interface ITask extends IMonad<KTask> {
    /** Creates a function that returns a `Task` from a function that returns a `TaskLike`. */
    fun<T, A extends any[]>(f: (...a: A) => TaskLike<T>): (...args: A) => Task<T>
    /** Creates a function that returns a `Task` from a `TaskLike`. */
    fun<T, A extends any[]>(asyncLike: TaskLike<T, A>): (...args: A) => Task<T>
    /** Calls the given task and returns its result. */
    run<A>(fa: Task<A>): Promise<A>
    /** Non-recursively evaluates the given free monad having as its underlying functor the task functor. */ 
    runFree<A>(t: Free<A, KTask>): Task<A>
    /** Monad's `bind` overload for `Task`, allowing for a mapping function that returns a `TaskLike` */
    bind<A, B>(fa: Task<A>, f: TaskLike<B, [A]>): Task<B>
    /** Monad's `flatMap` overload for `Task`, allowing for a mapping function that returns a `TaskLike` */
    flatMap<A, B>(f: TaskLike<B, [A]>): (fa: Task<A>) => Task<B>
    /** Creates a `Task` that when called, resolves after the given number of milliseconds. */
    delay(ms: number): Task<void>
    /** Runs a list of `Task`s in parallel and returns a list promises. */
    promises<A>(fa: Task<A>[]): Promise<A>[]
    /** Creates a task that is resolved with an array of results when all of the provided tasks resolve, or rejected when any task is rejected. */
    all<A>(fa: Task<A>[]): Task<A[]>
    /** Creates a task that is resolved or rejected when any of the provided tasks are resolved or rejected. */
    race<A>(fa: Task<A>[]): Task<A>
    /** Creates a task that is resolved with the value of the first task that resolves */
    any<A>(fa: Task<A>[]): Task<A>
    /** Memoizes the given task. */
    memo<A>(f: Task<A>): Task<A>
    /** Assigns an abort signal to the task's promise, causing it to reject with an `AbortError` if the signal is aborted. */
    abortable(signal: AbortSignal): <A>(fa: Task<A>) => Task<A>
    /** Creates a task that rejects with an `AbortError` if it is not resolved within the given number of milliseconds after it's called. */
    expirable(ms: number): <A>(fa: Task<A>) => Task<A>
    /** Attaches a callback for only the rejection of the task's promise. */
    catch<A, B>(f: (e: unknown) => Task<B>): (fa: Task<A>) => Task<A | B>
    /** Attaches a callback that is invoked when the task's promise is settled (fulfilled or rejected). */
    finally<A>(f: () => unknown): (fa: Task<A>) => Task<A>
}

/** An error thrown when a task is aborted. */
export class AbortError extends Error {
    constructor(msg?: string) {
        super(msg ?? 'Task was aborted');
        this.name = 'AbortError';
    }
}

/** The task module, providing functions to work with `Task` instances, which are promise-returning functions. */
export const task: ITask = (() => {
    return pipe(
        (() => {
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
        
            return {
                ...monad<KTask>({ unit, bind, flatMap, map }),
                fun
            };
        })(),
        base => {
            const delay = (ms: number): Task<void> => () => new Promise(resolve => setTimeout(resolve, ms));
            const promises = <A>(fa: Task<A>[]) => fa.map(t => t());
            const all = <A>(fa: Task<A>[]) => () => Promise.all(promises(fa));
            const race = <A>(fa: Task<A>[]) => () => Promise.race(promises(fa));
            const any = <A>(fa: Task<A>[]) => () => Promise.any(promises(fa));
            const run = <A>(fa: Task<A>) => fa();

            const runFree = <A>(t: Free<A, KTask>): Task<A> => async () => {
                while (t.right)
                    t = await t.value();
                
                return t.value;
            }

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
                ...base,
                run,
                runFree,
                delay,
                promises,
                all,
                race,
                any,
                memo,
                abortable,
                expirable,
                catch: _catch,
                finally: _finally,
            }
        }
    )
})();
