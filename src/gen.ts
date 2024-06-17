import { HKT } from "./hkt.js"
import { IMonad, monad } from "./monad.js"

type Gen<T> = AsyncGenerator<T, void, void>

export interface TGen extends HKT {
    readonly type: Gen<this["_A"]>
}

interface IGen extends IMonad<TGen> {
    from: <T>(genlike: (() => Gen<T>) | T[] | Gen<T>) => Gen<T>
    take: (n: number) => <T>(fa: Gen<T>) => Gen<T>
    forEach: <T>(f: (a: T) => void) => (fa: Gen<T>) => Gen<T>
    toArray: <T>(fa: Gen<T>) => Promise<T[]>
    filter: {
        <T, S extends T>(pred: (a: T) => a is S): (fa: Gen<T>) => Gen<S>
        <T>(pred: (a: T) => unknown): (fa: Gen<T>) => Gen<T>
    }
    takeWhile: <T>(pred: (a: T) => unknown) => (fa: Gen<T>) => Gen<T>
    skipWhile: <T>(pred: (a: T) => unknown) => (fa: Gen<T>) => Gen<T>
}

export const gen: IGen = (() => {
    async function* unit<T>(a: T): Gen<T> {
        yield a
    }

    async function* bind<T, U>(fa: Gen<T>, f: (a: T) => Gen<U>): Gen<U> {
        for await (const a of fa) {
            yield* f(a)
        }
    }

    async function* from<T>(genlike: (() => Gen<T>) | T[] | Gen<T>): Gen<T> {
        if (genlike instanceof Function) {
            yield* genlike()
        } else if (genlike instanceof Array) {
            for (const a of genlike)
                yield a
        } else {
            yield* genlike
        }
    }

    const take = (n: number) => async function* <T>(fa: Gen<T>): Gen<T> {
        for await (const a of fa) {
            if (n-- <= 0)
                break;

            yield a
        }
    }

    const forEach = <T>(f: (a: T) => void) => async function* (fa: Gen<T>): Gen<T> {
        for await (const a of fa) {
            f(a);
            yield a;
        }
    }

    const toArray = async <T>(fa: Gen<T>): Promise<T[]> => {
        const result: T[] = [];

        for await (const a of fa)
            result.push(a);

        return result;
    }

    const filter: {
        <T, S extends T>(pred: (a: T) => a is S): (fa: Gen<T>) => Gen<S>
        <T>(pred: (a: T) => unknown): (fa: Gen<T>) => Gen<T>
    } = <T>(pred: (a: T) => unknown): (fa: Gen<T>) => Gen<T> => async function* (fa) {
        for await (const a of fa) {
            if (pred(a))
                yield a;
        }
    }

    const takeWhile = <T>(pred: (a: T) => unknown) => async function* (fa: Gen<T>): Gen<T> {
        for await (const a of fa) {
            if (!await pred(a))
                break;

            yield a;
        }
    }

    const skipWhile = <T>(pred: (a: T) => unknown) => async function* (fa: Gen<T>): Gen<T> {
        let skip = true;

        for await (const a of fa) {
            if (skip && !await pred(a))
                skip = false;

            if (!skip)
                yield a;
        }
    }

    const genMonad = monad<TGen>({
        unit,
        bind
    });

    return {
        from,
        take,
        forEach,
        toArray,
        filter,
        takeWhile,
        skipWhile,
        ...genMonad
    }
})();
