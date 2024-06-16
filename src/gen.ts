import { HKT } from "./hkt.js"
import { monad } from "./monad.js"

type Gen<T> = AsyncGenerator<T, void, void>

export interface GenHKT extends HKT {
    readonly type: Gen<this["_A"]>
}

export namespace Gen {
    export async function* unit<T>(a: T): Gen<T> {
        yield a
    }

    export async function* bind<T, U>(fa: Gen<T>, f: (a: T) => Gen<U>): Gen<U> {
        for await (const a of fa) {
            yield* f(a)
        }
    }

    export async function* from<T>(genlike: (() => Gen<T>) | T[] | Gen<T>): Gen<T> {
        if (genlike instanceof Function) {
            yield* genlike()
        } else if (genlike instanceof Array) {
            for (const a of genlike) 
                yield a
        } else {
            yield* genlike
        }
    }

    export const take = (n: number) => async function* <T>(fa: Gen<T>): Gen<T> {
        for await (const a of fa) {
            if (n-- <= 0) 
                break;

            yield a
        }
    }

    export const forEach = <T>(f: (a: T) => void) => async function* (fa: Gen<T>): Gen<T> {
        for await (const a of fa) {
            f(a);
            yield a;
        }
    }

    export const toArray = async <T>(fa: Gen<T>): Promise<T[]> => {
        const result: T[] = [];

        for await (const a of fa) 
            result.push(a);
        
        return result;
    }

    export function filter<T, S extends T>(pred: (a: T) => a is S): (fa: Gen<T>) => Gen<S>
    export function filter<T>(pred: (a: T) => unknown): (fa: Gen<T>) => Gen<T> {
        return async function* (fa) {
            for await (const a of fa) {
                if (pred(a))
                    yield a;
            }
        }
    }

    export const takeWhile = <T>(pred: (a: T) => unknown) => async function* (fa: Gen<T>): Gen<T> {
        for await (const a of fa) {
            if (!await pred(a))
                break;

            yield a;
        }
    }

    export const skipWhile = <T>(pred: (a: T) => unknown) => async function* (fa: Gen<T>): Gen<T> {
        let skip = true;

        for await (const a of fa) {
            if (skip && !await pred(a))
                skip = false;

            if (!skip)
                yield a;
        }
    }
}

export const genMonad = monad<GenHKT>({
    unit: Gen.unit,
    bind: Gen.bind
});
