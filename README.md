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

To apply arguments to higher-kinded types, use the `$` operator like `$<F, A>`, where `F` is a higher-kinded type and `A` is the type argument:

```typescript
import { $ } from '@jsoldi/hkt';

type NumberLog = $<KLog, number>; // Evaluates to `Log<number>`
```

Higher kinded types can themselves be used as type arguments. For instance, this is the `IMonadBase` definition, which can be passed to the `monad` function to produce an `IMonad`:

```typescript
export interface IMonadBase<F> {
    unit<A>(a: A): $<F, A>
    bind<A, B>(fa: $<F, A>, f: (a: A) => $<F, B>): $<F, B>
}
```

## Examples

### Writing a custom monad

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
function logFetchURL(url: string): Log<string> {
    try {
        const data = fetchURL(url);
        return logger.log('Success', data); // Log success
    } catch (e: any) {
        return logger.log('Error', ''); // Log error
    }
}

// `pipe` passes the first argument to the function composition of the rest
const result: Log<string[]> = pipe(
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

console.log(result); 
// [
//   ['Success', 'Error', 'Success', 'Error'],  // Logs
//   ['GOOD', 'GOOD']                           // Results
// ]
```

### Using continuations to handle callbacks and avoid stack overflow 

```typescript
// Stack-safe trampoline combining continuations and thunks
const sync = cont.syncThunk;

// Fibonacci sequence using trampoline and memoization
const fibonacci = sync.memo((n: bigint): ContSync<bigint> => {
    if (n < 2)
        return sync.unit(1n);

    // Like `pipe` but specialized to monads
    return sync.pipe(
        sync.lazy(() => fibonacci(n - 1n)),
        _ => sync.lazy(() => fibonacci(n - 2n)),
        (m1, m2) => sync.unit(m1 + m2)
    );
});

// Prompt function as a void returning continuation
const prompt = (message: string): ContVoid<string> => resolve => {
    console.log(message);

    process.stdin.addListener("data", function listen(data) {
        process.stdin.removeListener("data", listen);
        resolve(data.toString().trim());
    });
};

pipe(
    cont.void.map(
        prompt('Enter position in Fibonacci sequence or "exit": '),
        input => {
            try {
                return input === 'exit' ? false : pipe(
                    input, 
                    BigInt, 
                    fibonacci, 
                    sync.run,
                    n => console.log('Result', n, '\n'),
                    _ => true
                );
            } catch (e) {
                console.log('Invalid number\n');
                return true;
            }
        }
    ),
    cont.void.doWhile(id) // Loop while true
)(_ => process.exit(0));
```