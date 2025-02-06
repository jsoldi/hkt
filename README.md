# @jsoldi/hkt

Lightweight higher-kinded types for TypeScript, defining basic type classes such as `Monad`, `Monoid`, and `Functor`, together with implementations for common JavaScript types such as `Array`, `Promise` and `AsyncGenerator`.

## Installation

```sh
npm install @jsoldi/hkt
```

## Example

```typescript
import { array } from "./array.js";
import { KRoot } from "./hkt.js";
import { monad } from "./monad.js";
import { pipe } from "./utils.js";

// Non higher-kinded Log type
export type Log<T> = [string[], T];

// Higher-kinded Log type. 
// The `$` operator can be used to pass arguments. 
// For instance, `$<KLog, boolean>` evaluates to `Log<boolean>`
export interface KLog extends KRoot {
    readonly 0: unknown;
    readonly body: Log<this[0]>;
}

// Custom monad implementation using the `KLog` type
const logger = {
    ...monad<KLog>({
        unit: a => [[], a], 
        bind: ([logA, a], f) => {
            const [logB, b] = f(a); 
            return [[...logA, ...logB], b]; // Concatenate logs
        },
    }),
    log: <A>(log: string, a: A): Log<A> => [[log], a] // Utility function to add a log entry
}

// Normal fetch
function fetchURL(url: string) {
    if (url.startsWith('https://')) {
        return `Good`;
    } else {
        throw new Error(`Bad`);
    }
}

// Logging fetch
function logFetchURL(url: string) {
    try {
        const data = fetchURL(url);
        return logger.log('Success', data); // Log success
    } catch (e: any) {
        return logger.log(`Error`, null); // Log error
    }
}

// `pipe` passes the first argument to the function composition of the rest
const result = pipe(
    logger.sequence([
        logFetchURL('https://example/1'),
        logFetchURL('file:///localhost/1'),
        logFetchURL('https://example/2'),
        logFetchURL('file:///localhost/2'),
    ]),
    logger.fmap(array.filter(s => s !== null)),     // Filter out null values
    logger.fmap(array.fmap(s => s.toUpperCase()))   // Make results uppercase
);

console.log(result); // [[ 'Success', 'Error', 'Success', 'Error' ], [ 'GOOD', 'GOOD' ]]
```

