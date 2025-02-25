// import { $, KType } from "./core/hkt.js";
// import { cont } from "./types/cont/cont.js";
// import { lazy } from "./types/lazy.js";

// // Stack-safe trampoline combining continuations and thunks
// const sync = cont.trampoline;
// type ContSync<T> = $<KType<typeof sync>, T>;
// //const sync = cont.thunkSync;

// // Fibonacci sequence using trampoline and memoization
// const fibonacci = sync.memo((n: bigint): ContSync<bigint> => {
//     if (n < 2)
//         return sync.unit(n);

//     // Like `pipe` but specialized to monads
//     return sync.pipe(
//         sync.suspend(() => fibonacci(n - 1n)),
//         _ => sync.suspend(() => fibonacci(n - 2n)),
//         (m1, m2) => sync.unit(m1 + m2)
//     );
// });

// const tele = sync.run(fibonacci(20000n))();
// console.log(tele);

// // // Prompt function as a void returning continuation
// // const prompt = (message: string): ContVoid<string> => resolve => {
// //     console.log(message);

// //     process.stdin.addListener("data", function listen(data) {
// //         process.stdin.removeListener("data", listen);
// //         resolve(data.toString().trim());
// //     });
// // };

// // pipe(
// //     cont.void.map(
// //         prompt('Enter position in Fibonacci sequence or "exit": '),
// //         input => {
// //             try {
// //                 if (input === 'exit') 
// //                     return true;

// //                 const result = pipe(input, BigInt, fibonacci, sync.run);
// //                 console.log('Result', result, '\n');
// //             } catch (e) {
// //                 console.log('Invalid number\n');
// //             }
// //         }
// //     ),
// //     cont.void.doWhile(exit => !exit) // Loop until exit is true
// // )(_ => process.exit(0));