// import { KRoot, monad } from './index.js';

// // Non higher-kinded Log type
// type Log<T> = [string[], T];

// // Higher-kinded Log type
// interface KLog extends KRoot {
//     readonly 0: unknown;
//     readonly body: Log<this[0]>;
// }

// const logger = {
//     // Custom monad implementation
//     ...monad<KLog>({
//         unit: a => [[], a], 
//         bind: ([logA, a], f) => {
//             const [logB, b] = f(a); 
//             return [[...logA, ...logB], b]; // Concatenate logs
//         },
//     }),
//     log: <A>(log: string, a: A): Log<A> => [[log], a] // Add a log 
// }

// const add = (a: number, b: number): Log<number> => 
//     logger.log(`Adding ${a} and ${b}`, a + b);

// const mul = (a: number, b: number): Log<number> => 
//     logger.log(`Multiplying ${a} and ${b}`, a * b);

// const res = logger.pipe(
//     logger.unit(1),
//     x => mul(x, 2),
//     x => add(x, 3)
// );

// console.log(res); // [["Multiplying 1 and 2", "Adding 2 and 3"], 5]