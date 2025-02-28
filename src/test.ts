// import { monadPlus } from "./classes/monadPlus.js";
// import { KRoot, KTypeOf } from "./core/hkt.js";
// import { cont } from "./types/cont/cont.js";
// import { maybe } from "./types/maybe.js";
// import { object } from "./types/object.js";
// import { num } from "./types/primitive.js";
// import { reader } from "./types/reader.js";
// import { state } from "./types/state.js";
// import { task } from "./types/task.js";

// const t = cont.trampoline;

// const mt = maybe.transform(t);
// const smt = state.of<string>().transform(mt);
// type Parser<T> = KTypeOf<typeof smt, T>;

// interface KParser extends KRoot {
//     readonly 0: unknown
//     readonly body: Parser<this[0]>
// }

// const parser = (() => {
//     const unit = <A>(a: A): Parser<A> => smt.unit(a);

//     const bind = <A, B>(bp: Parser<A>, fb: (a: A) => Parser<B>): Parser<B> => {
//         return smt.bind(bp, a => ((input) => t.suspend(() => fb(a)(input))));
//     }

//     const empty = <A>(): Parser<A> => _ => mt.empty();

//     const append = <A>(p1: Parser<A>, p2: Parser<A>): Parser<A> => (input: string) => {
//         return mt.append(p1(input), t.suspend(() => p2(input)));
//     }

//     const regex = (re: RegExp): Parser<string> => (input: string) => {
//         const match = input.match(re);

//         return t.unit(
//             match === null ? maybe.nothing : maybe.unit([match[0], input.slice(match[0].length)])
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
// const result = t.drop(test(digits + 'rest'))();

// console.log(result);

// //------------------------------------------------------------------------------------------------
