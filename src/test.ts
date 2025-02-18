// import { cont } from "./cont/cont.js";
// import { ContSync } from "./cont/contThunk.js";
// import { ContVoid } from "./cont/contVoid.js";
// import { id, pipe } from "./utils.js";

// const sync = cont.sync;

// const fibonacci = sync.memoize((n: bigint): ContSync<bigint> => {
//     if (n < 2)
//         return sync.unit(1n);

//     return sync.pipe(
//         sync.lazy(() => fibonacci(n - 1n)),
//         _ => sync.lazy(() => fibonacci(n - 2n)),
//         (m1, m2) => sync.unit(m1 + m2)
//     );
// });

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
//                 console.log('Invald number\n');
//                 return true;
//             }
//         }
//     ),
//     cont.void.doWhile(id)
// )(_ => process.exit(0));
