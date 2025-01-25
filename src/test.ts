// import { array } from "./array.js";
// import { Async, async } from "./async.js";
// import { constant } from "./constant.js";
// import { $, $K } from "./hkt.js";
// import { monoidFor } from "./monoid.js";
// import { num, string } from "./primitive.js";
// import { set } from "./set.js";
// import { pipe } from "./utils.js";

// const lol = async.semiring(string);

// async function* one() {
//     yield 'a';
//     yield 'b';
//     yield 'c';
// }

// async function* two() {
//     yield '1';
//     yield '2';
// }

// const tela = async.fromFun(async function*<T>(t: T) {
//     yield t;
//     yield t;    
//     yield t;
// });

// const rek = lol.times(tela('___'), two);

// for await (const a of rek()) {
//     console.log(a);
// }
