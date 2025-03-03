# @jsoldi/hkt

Lightweight library that brings Haskell-style higher-kinded types to TypeScript for type-safe functional programming. It includes common abstractions like Monad, Functor, and Monoid, along with implementations for common JavaScript objects. The idea is to provide a solid foundation for functional programming without abandoning JavaScript's natural constructs.

As an example, instead of directly defining a *foldable* interface, the library provides a more general *fold* interface (with *foldable* as a special case), where results are wrapped in a monad. This approach allows types like `AsyncGenerator` to be folded by returning a task (a promise returning function), adding foldable capabilities to async generators.

The aim is for the library to integrable seamlessly into existing projects and start getting the benefits of functional programming right away, without the need to adopt a new paradigm or to rewrite existing code.

## Installation

```sh
npm install @jsoldi/hkt
```

## Examples

### Piping computations

```typescript
import { array } from '@jsoldi/hkt';

// Monad's `pipe` emulates Haskell's do notation. Each function 
// receives all the previous results in reverse order.
const res = array.pipe(
    ['♦️', '♣️', '♥️', '♠️'], // suits
    _ => array.range(1, 13), // ranks
    (rank, suit) => [`${rank}${suit}`] // rank-suit pairs
); 

console.log(res); // ['1♦️', '2♦️', '3♦️', '4♦️', …, '12♠️', '13♠️']
```

### Binary counting

```typescript
import { array, string } from '@jsoldi/hkt';

// This semiring uses array's `bind` to distribute addition (array 
// concatenation) over multiplication (string concatenation), 
const s = array.semiring(string);
const arg = array.replicate(5, ['0', '1']); // ['0', '1'] × 5
const res = s.times(...arg); // ('0' + '1') × ('0' + '1') … 
console.log(res); // ['00000', '00001', '00010',  …, '11111']
```

## Higher-kinded types

Higher kinded types can be defined by extending the `KRoot` interface:

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

// …
type NumberLog = $<KLog, number>; // Evaluates to `Log<number>`
```

Higher kinded types can themselves be used as type arguments. For instance, this is the `IMonadBase` definition, which can be passed to the `monad` function to produce an `IMonad`:

```typescript
export interface IMonadBase<F> {
    unit<A>(a: A): $<F, A>
    bind<A, B>(fa: $<F, A>, f: (a: A) => $<F, B>): $<F, B>
}
```

### Defining a custom monad

```typescript
import { KRoot, monad } from '@jsoldi/hkt';

// Non higher-kinded Log type
type Log<T> = [string[], T];

// Higher-kinded Log type
interface KLog extends KRoot {
    readonly 0: unknown;
    readonly body: Log<this[0]>;
}

const logger = {
    // Custom monad implementation
    ...monad<KLog>({
        unit: a => [[], a], 
        bind: ([logA, a], f) => {
            const [logB, b] = f(a); 
            return [[...logA, ...logB], b]; // Concatenate logs
        },
    }),
    log: <A>(log: string, a: A): Log<A> => [[log], a] // Add a log 
}

const add = (a: number, b: number): Log<number> => 
    logger.log(`Adding ${a} and ${b}`, a + b);

const mul = (a: number, b: number): Log<number> => 
    logger.log(`Multiplying ${a} and ${b}`, a * b);

const res = logger.pipe(
    logger.unit(1),
    x => mul(x, 2),
    x => add(x, 3)
);

console.log(res); // [["Multiplying 1 and 2", "Adding 2 and 3"], 5]
```

## Advanced examples

### Continuations and Trampolines

```typescript
import { pipe, KTypeOf, cont, ContVoid } from '@jsoldi/hkt';

// Stack-safe trampoline which combines continuations and thunks
const t = cont.trampoline;
type Trampoline<T> = KTypeOf<typeof t, T>;
// Trampoline<T> = <R>(resolve: (t: T) => Free<R, KLazy>) => Free<R, KLazy>

// Fibonacci sequence using trampoline and memoization
const fibonacci = t.memo((n: bigint): Trampoline<bigint> => {
    if (n < 2)
        return t.unit(n);

    return t.pipe(
        t.suspend(() => fibonacci(n - 1n)),
        _ => t.suspend(() => fibonacci(n - 2n)),
        (m1, m2) => t.unit(m1 + m2)
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

// Standalone `pipe` is the trivial (identity) monad's `pipe` — passing 
// the first argument through the (reversed) function composition of the 
// rest.
pipe(
    cont.void.map(
        prompt('Enter position in Fibonacci sequence or "exit": '),
        input => {
            try {
                if (input === 'exit') 
                    return true;

                const result = pipe(input, BigInt, fibonacci, t.run)();
                console.log('Result', result, '\n');
            } catch (e) {
                console.log('Invalid number\n');
            }
        }
    ),
    cont.void.doWhile(exit => !exit) // Loop until exit is true
)(_ => process.exit(0));
```

### Stack-safe arithmetic parser

```typescript
import { 
    cont, 
    maybe, 
    state, 
    KTypeOf, 
    KRoot, 
    monadPlus, 
    chain, 
    lazy 
} from '@jsoldi/hkt';

// Alias for trampline
const t = cont.trampoline;

// Put maybe inside trampoline
const m = maybe.transform(t);

// Put trampoline inside state monad
const s = state.of<string>().transform(m); 

// Non-higher-kinded parser type
type Parser<T> = KTypeOf<typeof s, T>; 
// Parser<T> = (a: string) => Cont<Maybe<[T, string]>, KFree<KLazy>>

// Higher-kinded parser type
interface KParser extends KRoot {
    readonly 0: unknown
    readonly body: Parser<this[0]>
}

const parser = (() => {
    // Create a monadPlus (monad + monoid) instance for the parser
    const base = monadPlus<KParser>({ 
        unit: s.unit,
        // Suspend the computation of the second parser for lazy evaluation
        bind: (p, f) => 
            s.bind(p, a => input => t.suspend(() => f(a)(input))),
        empty: () => _ => m.empty(),
        // `append` outputs the first non-empty result
        // No need to run the second parser if the first one succeeds
        append: (p1, p2) => input => 
            m.append(p1(input), t.suspend(() => p2(input)))
    });

    // Next character parser
    const next: Parser<string> = input => input.length === 0 
        ? m.empty() 
        : m.unit([input[0], input.slice(1)]);

    // Regex parser
    const regex = (re: RegExp): Parser<string> => (input: string) => {
        const match = input.match(re);

        return match === null
            ? m.empty()
            : m.unit([match[0], input.slice(match[0].length)]);
    }

    // Chain left-associative parser
    const chainl1 = <A>(
        p: Parser<A>, 
        op: Parser<(a: A, b: A) => A>
    ): Parser<A> => 
        base.bind(
            p,
            a => base.map(
                base.many(
                    base.bind(
                        op,
                        f => base.map(p, b => (x: A) => f(x, b))
                    )
                ),
                vs => vs.reduce((a, f) => f(a), a)
            )
        );

    // Character parser
    const char = (c: string) => base.filter<string>(s => s === c)(next);

    return { ...base, next, regex, chainl1, char }
})();

const math = (() => {
    // Number parser
    const num = parser.map(parser.regex(/^\d+(\.\d+)?/), parseFloat);

    // Addition and subtraction parser
    const addOp = parser.append(
        parser.map(parser.char('+'), _ => (a: number, b: number) => a + b),
        parser.map(parser.char('-'), _ => (a: number, b: number) => a - b)
    );

    // Multiplication and division parser
    const mulOp = parser.append(
        parser.map(parser.char('*'), _ => (a: number, b: number) => a * b),
        parser.map(parser.char('/'), _ => (a: number, b: number) => a / b)
    );

    // Numbers and groups parser
    const group: Parser<number> = parser.append(
        num,
        parser.pipe(
            parser.char('('),
            _ => expr,
            _ => parser.char(')'),
            (_, n) => parser.unit(n)
        )
    );

    // Arithmetic expression parser
    const expr = parser.chainl1(
        parser.chainl1(
            group,  // Parse numbers and groups first
            mulOp   // Then parse multiplication and division
        ),
        addOp       // Finally parse addition and subtraction
    );

    // Remove whitespace and parse expression
    const parse = chain(
        (s: string) => s.replace(/\s/g, ''), 
        expr, 
        m.fmap(([n]) => n),
        m.else(() => t.unit('Invalid expression')),
        t.run,
        lazy.run
    );

    return { ...parser, num, addOp, mulOp, group, expr, parse }
})();

console.log(math.parse('10.1 + 20 * 30 + 40')); // 650.1

// Trampoline is stack-safe
console.log(math.parse(
    Array.from({ length: 10000 }, (_, i) => i).join('+')
)); // 49995000
```
