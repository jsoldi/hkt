import { KRoot } from "./hkt.js";
import { IMonad, monad } from "./monad.js";

export interface KPromise extends KRoot {
    readonly 0: unknown
    readonly body: Promise<this[0]>
}

export interface IPromise extends IMonad<KPromise> {
    delay: (ms: number) => Promise<void>
    all: <A>(fa: Promise<A>[]) => Promise<A[]>
    race: <A>(fa: Promise<A>[]) => Promise<A>
    any: <A>(fa: Promise<A>[]) => Promise<A>
    timeout: (ms: number) => <A>(fa: Promise<A>) => Promise<A>
    catch: <A, B>(f: (e: unknown) => Promise<B>) => (fa: Promise<A>) => Promise<A | B>
    finally: <A>(f: () => unknown) => (fa: Promise<A>) => Promise<A>
}

export const promise: IPromise = (() => {
    const unit: <A>(a: A) => Promise<A> = a => Promise.resolve(a);

    const bind: <A, B>(fa: Promise<A>, f: (a: A) => Promise<B>) => Promise<B> = (fa, f) => 
        fa.then(f); // this will flatten the promise if nested so just avoid nesting promises

    const delay: (ms: number) => Promise<void> = ms => new Promise(resolve => setTimeout(resolve, ms));
    const all: <A>(fa: Promise<A>[]) => Promise<A[]> = fa => Promise.all(fa);
    const race: <A>(fa: Promise<A>[]) => Promise<A> = fa => Promise.race(fa);
    const any: <A>(fa: Promise<A>[]) => Promise<A> = fa => Promise.any(fa);

    const timeout: (ms: number) => <A>(fa: Promise<A>) => Promise<A> = ms => fa => 
        new Promise((resolve, reject) => {
            const id = setTimeout(() => {
                clearTimeout(id);
                reject(new Error('Timeout'));
            }, ms);

            fa.then(a => {
                clearTimeout(id);
                resolve(a);
            }, reject);
        });

    const _catch: <A, B>(f: (e: unknown) => Promise<B>) => (fa: Promise<A>) => Promise<A | B> = 
        f => fa => fa.catch(f);

    const _finally: <A>(f: () => unknown) => (fa: Promise<A>) => Promise<A> =
        f => fa => fa.finally(f);

    const m = monad<KPromise>({ 
        unit,
        bind,
    });

    return {
        ...m,
        delay,
        all,
        race,
        any,
        timeout,
        catch: _catch,
        finally: _finally,
    }
})();
