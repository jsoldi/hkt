import { KRoot } from "./hkt.js";
import { IMonad, monad } from "./monad.js";

export type Cont<T> = (handle: (a: T) => unknown) => unknown

export interface KCont extends KRoot {
    readonly 0: unknown
    readonly body: Cont<this[0]>
}

export interface ICont extends IMonad<KCont> {
    delay: (ms: number) => Cont<void>
    from: <T>(f: () => T) => Cont<Awaited<T>>
}

export const cont: ICont = (() => {
    const unit: <A>(a: A) => Cont<A> = a => handle => handle(a);
    const bind: <A, B>(fa: Cont<A>, f: (a: A) => Cont<B>) => Cont<B> = (fa, f) => handle => fa(a => f(a)(handle));
    const delay: (ms: number) => Cont<void> = ms => handle =>  setTimeout(handle, ms);
    const from: <T>(f: () => T) => Cont<Awaited<T>> = f => handle => (async () => handle(await f()))();

    const contMonad = monad<KCont>({ 
        unit,
        bind,
    });

    return {
        delay,
        from,
        ...contMonad
    }
})();
