// import { monadPlus } from "./classes/monadPlus.js";
// import { KRoot, KTypeOf } from "./core/hkt.js";
// import { cont } from "./types/cont/cont.js";

// const trampoline = cont.trampoline;
// type Trampoline<A> = KTypeOf<typeof trampoline, A>;
// type Parser<T> = (input: string) => Trampoline<[T, string] | null>;

// interface KParser extends KRoot {
//     readonly 0: unknown
//     readonly body: Parser<this[0]>
// }

// const parser = (() => {
//     const unit = <A>(a: A): Parser<A> => input => trampoline.unit([a, input]);

//     const bind = <A, B>(bp: Parser<A>, fb: (a: A) => Parser<B>): Parser<B> => (input: string) => {
//         return trampoline.bind(bp(input), pair => {
//             if (pair === null) 
//                 return trampoline.unit(null);

//             const [a, input2] = pair;
//             return trampoline.suspend(() => fb(a)(input2));
//         });
//     }

//     const empty = <A>(): Parser<A> => _ => trampoline.unit(null);

//     const append = <A>(p1: Parser<A>, p2: Parser<A>): Parser<A> => (input: string) => {
//         return trampoline.bind(
//             p1(input),
//             pair => pair !== null ? trampoline.unit(pair) : p2(input)
//         )
//     }

//     const regex = (re: RegExp): Parser<string> => (input: string) => {
//         const match = input.match(re);

//         return trampoline.unit(
//             match === null ? null : [match[0], input.slice(match[0].length)]
//         );
//     }

//     return {
//         ...monadPlus<KParser>({ unit, bind, empty, append }),
//         regex
//     }
// })();

// let digit = 0;
// const nextDigit = () => (digit++ % 10).toString();
// const digits = Array.from({ length: 10000 }, nextDigit).join('');

// const test = parser.some(parser.regex(/^\d/));
// const result = trampoline.drop(test(digits + 'rest'))();

// console.log(result);

// //---------------------------------------------------------------------------------------------------------------------------------------------
