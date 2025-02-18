# @jsoldi/hkt

Lightweight higher-kinded types for TypeScript, defining basic type classes such as `Monad`, `Monoid`, and `Functor`, together with implementations for common JavaScript types such as `Array`, `Promise` and `AsyncGenerator`.

## Installation

```sh
npm install @jsoldi/hkt
```

## Usage

Higher kinded types can be defined by extending from the `KRoot` interface:

```typescript
import { KRoot } from '@jsoldi/hkt';

// Non higher-kinded Log type
type Log<T> = [string[], T];

// Higher-kinded Log type
interface KLog extends KRoot {
    readonly 0: unknown;
    readonly body: Log<this[0]>;
}
```

To pass arguments to a higher-kinded type, use the `$` operator:

```typescript
type NumberLog = $<KLog, number>; // Evaluates to `Log<number>`
```

Higher kinded types can be used to define type classes. For instance this is the `IMonadBase` definition, which is passed to the `monad` function to create an instance of `IMonad`:

```typescript
import { $ } from '@jsoldi/hkt';

export interface IMonadBase<F> {
    unit<A>(a: A): $<F, A>
    bind<A, B>(fa: $<F, A>, f: (a: A) => $<F, B>): $<F, B>
}
```

Putting it all together:

```typescript
import { KRoot, monad, pipe, array } from '@jsoldi/hkt';

// Non higher-kinded Log type
type Log<T> = [string[], T];

// Higher-kinded Log type
interface KLog extends KRoot {
    readonly 0: unknown;
    readonly body: Log<this[0]>;
}

// Custom monad implementation using the `KLog` type. 
const logger = {
    ...monad<KLog>({
        unit: a => [[], a], 
        bind: ([logA, a], f) => {
            const [logB, b] = f(a); 
            return [[...logA, ...logB], b]; // Concatenate logs
        },
    }),
    log: <A>(log: string, a: A): Log<A> => [[log], a] // Add a log entry
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
    // `sequence` takes an array of monads and returns a monad of an array    
    array.sequence(logger)([
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
