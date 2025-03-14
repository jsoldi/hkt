import { KRoot } from "../core/hkt.js";
import { AbortError } from "./task.js";
import { functor, IFunctor } from "../classes/functor.js";

/** The higher-kinded type of TypeScript's `Promise` type. */
export interface KPromise extends KRoot {
    readonly 0: unknown
    readonly body: Promise<this[0]>
}

/** The promise interface, providing a set of functions for working with promises. For monadic promises use `task` instead. */
export interface IPromise extends IFunctor<KPromise> {
    /** Creates a promise that resolves after the given number of milliseconds. */
    delay(ms: number): Promise<void>
    /** Creates a Promise that is resolved with an array of results when all of the provided Promises resolve, or rejected when any Promise is rejected. */
    all<A>(fa: Promise<A>[]): Promise<A[]> 
    /** Creates a Promise that is resolved or rejected when any of the provided Promises are resolved or rejected. */
    race<A>(fa: Promise<A>[]): Promise<A>
    /** Creates a Promise that is resolved with the value of the first promise that resolves */
    any<A>(fa: Promise<A>[]): Promise<A> 
    /** Assigns an abort signal to a promise, causing it to reject with an `AbortError` if the signal is aborted. */
    abortable(signal: AbortSignal): <A>(fa: Promise<A>) => Promise<A>
    /** Creates a promise that rejects with an `AbortError` if it is not resolved within the given number of milliseconds. */
    expirable(ms: number): <A>(fa: Promise<A>) => Promise<A>
    /** Attaches a callback for only the rejection of the Promise. */
    catch<A, B>(f: (e: unknown) => Promise<B>): (fa: Promise<A>) => Promise<A | B>
    /** Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). */
    finally<A>(f: () => unknown): (fa: Promise<A>) => Promise<A>
}

/** The promise module, providing a set of functions for working with promises. For monadic promises use `task` instead. */
export const promise: IPromise = (() => {
    const unit: <A>(a: A) => Promise<A> = a => Promise.resolve(a);

    const apply: <A, B>(fab: Promise<(a: A) => B>) => (fa: Promise<A>) => Promise<B> = fab => fa =>
        fab.then(fa.then);

    const delay: (ms: number) => Promise<void> = ms => new Promise(resolve => setTimeout(resolve, ms));
    const all: <A>(fa: Promise<A>[]) => Promise<A[]> = fa => Promise.all(fa);
    const race: <A>(fa: Promise<A>[]) => Promise<A> = fa => Promise.race(fa);
    const any: <A>(fa: Promise<A>[]) => Promise<A> = fa => Promise.any(fa);

    const abortable: (signal: AbortSignal) => <A>(fa: Promise<A>) => Promise<A> = signal => fa =>
        new Promise((resolve, reject) => {
            const doAbort = () => reject(new AbortError());

            if (signal.aborted)
                return doAbort();

            signal.addEventListener('abort', doAbort);
            fa.then(resolve, reject).finally(() => signal.removeEventListener('abort', doAbort));
        });

    const expirable: (ms: number) => <A>(fa: Promise<A>) => Promise<A> = ms => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), ms);
        return fa => abortable(controller.signal)(fa).finally(() => clearTimeout(id));
    }

    const _catch: <A, B>(f: (e: unknown) => Promise<B>) => (fa: Promise<A>) => Promise<A | B> = 
        f => fa => fa.catch(f);

    const _finally: <A>(f: () => unknown) => (fa: Promise<A>) => Promise<A> =
        f => fa => fa.finally(f);

    return {
        ...functor<KPromise>({ 
            map: (fa, f) => fa.then(f)
        }),
        delay,
        all,
        race,
        any,
        abortable,
        expirable,
        catch: _catch,
        finally: _finally,
    }
})();
