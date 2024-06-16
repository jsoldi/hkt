import { HKT } from "./hkt.js";
import { monad } from "./monad.js";

type ContFun<T> = (handle: (a: T) => void) => void

export interface ContHKT extends HKT {
    readonly type: ContFun<this["_A"]>
}

export namespace Cont {
    export function unit<A>(a: A): ContFun<A> {
        return handle => handle(a);
    }

    export function bind<A, B>(fa: ContFun<A>, f: (a: A) => ContFun<B>): ContFun<B> {
        return handle => fa(a => f(a)(handle));
    }

    export function delay(ms: number): ContFun<void> {
        return (handle: () => void) => setTimeout(handle, ms);
    }

    export function lazy<T>(f: () => T): ContFun<Awaited<T>> {
        return handle => (async () => handle(await f()))()
    }
}

export const contMonad = monad<ContHKT>({
    unit: Cont.unit,
    bind: Cont.bind
});

