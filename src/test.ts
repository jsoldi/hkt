// import { array } from "./array.js";
// import { Async, async } from "./async.js";

// const lel = async.from(['a', 'b', 'c']);

// const test = await async.foldl<string, [boolean, Async<string>]>(([isFirst, acc], a) => 
//     [false, async.append(
//         acc, 
//         async.append(
//             isFirst ? async.empty<string>() : async.wrap(async.scalar.unit(',')),
//             async.wrap(async.scalar.unit(a)),
//         )
//     )]
// )([true, async.empty<string>()])(lel);

// console.log(await async.toArray(test[1]));
