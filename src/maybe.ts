import { Either } from "./either.js";
import { ILeft, left } from "./left.js";

export interface IFail extends ILeft<Error> {
    tryCatch<A>(onTry: () => A): Either<A, Error>;
    tryCatch<A>(onTry: () => A, onCatch: (e: unknown) => Error): Either<A, Error>;
}

export const fail: IFail = (() => {
    const leftError = left<Error>();

    return { 
        ...leftError, 
        tryCatch: (onTry, onCatch?: (e: unknown) => Error) => 
            leftError.tryCatch(onTry, onCatch ?? (e => e instanceof Error ? e : new Error(String(e))))
    };
})();

export interface IMaybe extends ILeft<void> {
    readonly nothing: Either<unknown, void>
    readonly tryIgnore: <A>(onTry: () => A) => Either<A, void>
}

export const maybe: IMaybe = (() => {
    const leftVoid = left<void>();

    return {
        ...leftVoid,
        nothing: leftVoid.alt(undefined),
        tryIgnore: a => leftVoid.tryCatch(a, () => undefined)
    }
})();
