// import { pipe, KTypeOf, cont, ContVoid } from './index.js';

// // Stack-safe trampoline combining continuations and thunks (lazy free monad)
// const t = cont.trampoline;
// type Trampoline<T> = KTypeOf<typeof t, T>;

// // Fibonacci sequence using trampoline and memoization
// const fibonacci = t.memo((n: bigint): Trampoline<bigint> => {
//     if (n < 2)
//         return t.unit(n);

//     // Like `pipe` but specialized to the monad
//     return t.pipe(
//         t.suspend(() => fibonacci(n - 1n)),
//         _ => t.suspend(() => fibonacci(n - 2n)),
//         (m1, m2) => t.unit(m1 + m2)
//     );
// });

// // Prompt function as a void returning continuation
// const prompt = (message: string): ContVoid<string> => resolve => {
//     console.log(message);

//     process.stdin.addListener("data", function listen(data) {
//         process.stdin.removeListener("data", listen);
//         resolve(data.toString().trim());
//     });
// };

// pipe(
//     cont.void.map(
//         prompt('Enter position in Fibonacci sequence or "exit": '),
//         input => {
//             try {
//                 if (input === 'exit') 
//                     return true;

//                 const result = pipe(input, BigInt, fibonacci, t.run)();
//                 console.log('Result', result, '\n');
//             } catch (e) {
//                 console.log('Invalid number\n');
//             }
//         }
//     ),
//     cont.void.doWhile(exit => !exit) // Loop until exit is true
// )(_ => process.exit(0));