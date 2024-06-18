import { KRoot } from "./hkt.js";
import { IMonad, monad } from "./monad.js";

export type Cont<T> = (handle: (a: T) => void) => void

export interface TCont extends KRoot {
    readonly 0: unknown
    readonly body: Cont<this[0]>
}

export interface ICont extends IMonad<TCont> {
    delay: (ms: number) => Cont<void>
    lazy: <T>(f: () => T) => Cont<T>
}

export const cont: ICont = (() => {
    const delay = (ms: number): Cont<void> => handle => setTimeout(handle, ms);
    const lazy = <T>(f: () => T): Cont<T> => handle => (async () => handle(await f()))();

    const contMonad = monad<TCont>({
        unit: a => handle => handle(a),
        bind: (fa, f) => handle => fa(a => f(a)(handle))
    });

    return {
        delay,
        lazy,
        ...contMonad
    }
})();
