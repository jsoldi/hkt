import { array } from "./array.js";
import { number } from "./number.js";
import { chain, pipe } from "./utils.js";

export * from "./hkt.js";
export * from "./utils.js";
export * from "./functor.js";
export * from "./monad.js";
export * from "./trivial.js";
export * from "./transformer.js";
export * from "./array.js";
export * from "./either.js";
export * from "./maybe.js";
export * from "./gen.js";
export * from "./promise.js";
export * from "./reader.js";

declare global {
    var log: any;
}

Object.defineProperty(globalThis, 'log', {
    set: (v) => { console.log(v); }
});

// const nums = number.multiply(array);

// const one = () => nums.empty();
// const mult = (a: number[], b: number[]): number[] => nums.append(a, b);
// const add = (a: number[], b: number[]): number[] => nums.add(a, b);

// const a = [100, 200];
// const b = [10, 20];
// const c = [1, 2, 3]

// // test distributive property
// log = mult(add(a, b), c); // [100, 200, 10, 20] x [1, 2, 3]
// log = add(mult(a, c), mult(b, c)); // [100, 200] x [1, 2, 3] + [10, 20] x [1, 2, 3]
