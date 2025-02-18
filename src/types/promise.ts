import { KRoot } from "../core/hkt.js";
import { IMonad, monad } from "../classes/monad.js";
import { AbortError } from "./task.js";

/**
 * @deprecated use `KTask` instead
 */
export interface KPromise extends KRoot {
    readonly 0: unknown
    readonly body: Promise<this[0]>
}

/**
 * @deprecated use `ITask` instead
 */
export interface IPromise extends IMonad<KPromise> {
    delay: (ms: number) => Promise<void>
    all: <A>(fa: Promise<A>[]) => Promise<A[]>
    race: <A>(fa: Promise<A>[]) => Promise<A>
    any: <A>(fa: Promise<A>[]) => Promise<A>
    abort: (signal: AbortSignal) => <A>(fa: Promise<A>) => Promise<A>
    timeout: (ms: number) => <A>(fa: Promise<A>) => Promise<A>
    catch: <A, B>(f: (e: unknown) => Promise<B>) => (fa: Promise<A>) => Promise<A | B>
    finally: <A>(f: () => unknown) => (fa: Promise<A>) => Promise<A>
}

/**
 * @deprecated use `task` instead
 */
export const promise: IPromise = (() => {
    const unit: <A>(a: A) => Promise<A> = a => Promise.resolve(a);

    const bind: <A, B>(fa: Promise<A>, f: (a: A) => Promise<B>) => Promise<B> = (fa, f) => 
        fa.then(f); // this will flatten the promise if nested so just avoid nesting promises

    const delay: (ms: number) => Promise<void> = ms => new Promise(resolve => setTimeout(resolve, ms));
    const all: <A>(fa: Promise<A>[]) => Promise<A[]> = fa => Promise.all(fa);
    const race: <A>(fa: Promise<A>[]) => Promise<A> = fa => Promise.race(fa);
    const any: <A>(fa: Promise<A>[]) => Promise<A> = fa => Promise.any(fa);

    const abort: (signal: AbortSignal) => <A>(fa: Promise<A>) => Promise<A> = signal => fa =>
        new Promise((resolve, reject) => {
            const doAbort = () => reject(new AbortError());

            if (signal.aborted)
                return doAbort();

            signal.addEventListener('abort', doAbort);
            fa.then(resolve, reject).finally(() => signal.removeEventListener('abort', doAbort));
        });

    const timeout: (ms: number) => <A>(fa: Promise<A>) => Promise<A> = ms => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), ms);
        return fa => abort(controller.signal)(fa).finally(() => clearTimeout(id));
    }

    const _catch: <A, B>(f: (e: unknown) => Promise<B>) => (fa: Promise<A>) => Promise<A | B> = 
        f => fa => fa.catch(f);

    const _finally: <A>(f: () => unknown) => (fa: Promise<A>) => Promise<A> =
        f => fa => fa.finally(f);

    return {
        ...monad<KPromise>({ 
            map: (fa, f) => fa.then(f),
            unit,
            bind,
        }),
        delay,
        all,
        race,
        any,
        abort,
        timeout,
        catch: _catch,
        finally: _finally,
    }
})();
