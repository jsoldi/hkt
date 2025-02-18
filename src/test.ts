// import { pipe, id, cont, ContSync, ContVoid } from "./index.js";

// // Stack-safe trampoline combining continuations and thunks
// const sync = cont.thunkSync;

// // Fibonacci sequence using trampoline and memoization
// const fibonacci = sync.memo((n: bigint): ContSync<bigint> => {
//     if (n < 2)
//         return sync.unit(1n);

//     // Like `pipe` but specialized to monads
//     return sync.pipe(
//         sync.lazy(() => fibonacci(n - 1n)),
//         _ => sync.lazy(() => fibonacci(n - 2n)),
//         (m1, m2) => sync.unit(m1 + m2)
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
//                 return input === 'exit' ? false : pipe(
//                     input, 
//                     BigInt, 
//                     fibonacci, 
//                     sync.run,
//                     n => console.log('Result', n, '\n'),
//                     _ => true
//                 );
//             } catch (e) {
//                 console.log('Invalid number\n');
//                 return true;
//             }
//         }
//     ),
//     cont.void.doWhile(id) // Loop while true
// )(_ => process.exit(0));