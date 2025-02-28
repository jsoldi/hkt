import { KRoot } from "../core/hkt.js";
import { AbortError } from "./task.js";
import { functor, IFunctor } from "../classes/functor.js";

export interface KPromise extends KRoot {
    readonly 0: unknown
    readonly body: Promise<this[0]>
}

export interface IPromise extends IFunctor<KPromise> {
    delay: (ms: number) => Promise<void>
    all: <A>(fa: Promise<A>[]) => Promise<A[]>
    race: <A>(fa: Promise<A>[]) => Promise<A>
    any: <A>(fa: Promise<A>[]) => Promise<A>
    abort: (signal: AbortSignal) => <A>(fa: Promise<A>) => Promise<A>
    timeout: (ms: number) => <A>(fa: Promise<A>) => Promise<A>
    catch: <A, B>(f: (e: unknown) => Promise<B>) => (fa: Promise<A>) => Promise<A | B>
    finally: <A>(f: () => unknown) => (fa: Promise<A>) => Promise<A>
}

export const promise: IPromise = (() => {
    const unit: <A>(a: A) => Promise<A> = a => Promise.resolve(a);

    const apply: <A, B>(fab: Promise<(a: A) => B>) => (fa: Promise<A>) => Promise<B> = fab => fa =>
        fab.then(fa.then);

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
        ...functor<KPromise>({ 
            map: (fa, f) => fa.then(f)
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
