// import { monad } from "./classes/monad.js";
// import { monadPlus } from "./classes/monadPlus.js";
// import { KRoot, KTypeOf } from "./core/hkt.js";
// import { id } from "./core/utils.js";
// import { cont } from "./types/cont/cont.js";
// import { free, Free } from "./types/free/free.js";
// import { lazy } from "./types/lazy.js";

// type Parser<T> = (input: string) => [T, string] | null;

// interface KParser extends KRoot {
//     readonly 0: unknown
//     readonly body: Parser<this[0]>
// }

// const parser = (() => {
//     const unit = <A>(a: A): Parser<A> => input => [a, input];

//     const bind = <A, B>(bp: Parser<A>, fb: (a: A) => Parser<B>): Parser<B> => (input: string) => {
//         const pair = bp(input);
//         return pair === null ? null : fb(pair[0])(pair[1]);
//     }

//     const map = <A, B>(mp: Parser<A>, fm: (a: A) => B): Parser<B> => 
//         bind(mp, a => unit(fm(a)));

//     const empty = <A>(): Parser<A> => _ => null;

//     const append = <A>(p1: Parser<A>, p2: Parser<A>): Parser<A> => (input: string) => {
//         return p1(input) ?? p2(input);
//     }

//     const regex = (re: RegExp): Parser<string> => (input: string) => {
//         const match = input.match(re);
//         return match === null ? null : [match[0], input.slice(match[0].length)];
//     }

//     // const runFree = <A>(fp: Free<A, KParser>): Parser<A> => {
//     //     if (fp.right) {
//     //         return bind(fp.value, runFree);
//     //     } else {
//     //         return unit(fp.value);
//     //     }
//     // }

//     const runFree = <A>(fp: Free<A, KParser>): Parser<A> => (input: string) => {
//         console.log('runFree', fp);
//         let current = fp;

//         while (current.right) {
//             const pair = current.value(input);
            
//             if (pair === null) 
//                 return null;

//             current = pair[0];
//             input = pair[1];
//         }

//         return [current.value, input];
//     }

//     // const some3 = <A>(bp: Parser<A>): Parser<ConsList<Parser<A>>> => {
//     //     return bind(bp, a => {

//     //         //const result = unit(list.cons())

//     //         const rekt = map(append(some3(bp), unit(list.empty())), as => list.cons(unit(a), as));
//     //     });
//     // }

//     const some = <A>(bp: Parser<A>): Parser<A[]> => {
//         return bind(bp, a => map(append(some(bp), unit([])), as => [a, ...as]));
//     }

//     //const someThunk = <A>

//     // const some = <A>(bp: Parser<A>): Parser<A[]> => {
//     //     function fb(a: A): Parser<A[]> {    
//     //         return (input: string) => { // 3
//     //             const pair = some_v(input) ?? [[], input]; // 4 -> 1
//     //             return pair === null ? null : [[a, ...pair[0]], pair[1]];
//     //         }
//     //     };

//     //     function some_v(input: string): [A[], string] | null { // 1
//     //         const pair = bp(input);
//     //         return pair === null ? null : fb(pair[0])(pair[1]); // 2
//     //     };

//     //     return some_v; // 0
//     // }

//     // return { some };

//     return {
//         ...monadPlus<KParser>({ unit, bind, empty, append }),
//         runFree,
//         some,
//         regex
//     }
// })();

// const sync = cont.trampoline;
// type Sync<A> = KTypeOf<typeof sync, A>;

// const some = <A>(bp: Sync<A>): Sync<A[]> => {
//     const lulz = sync.bind(
//         bp,
//         a => {
//             const left = some(bp);
//             const right = sync.unit([]);
//             const lp = left(parser.unit);
//             const rp = right(parser.unit);
//             const res = parser.append(lp, rp);
//             return parser.map(res, as => [a, ...as]);
//         }
//     );
// }

// // let digit = 0;
// // const nextDigit = () => (digit++ % 10).toString();
// // const digits = Array.from({ length: 10000 }, nextDigit).join('');

// // // const test = parser.some(parser.regex(/^\d/));
// // // const result = test(digits + 'rest');

// // const test = some(sync.lift(() => parser.regex(/^\d/)));
// // const result = sync.drop(test)()(digits + 'rest');

// // console.log(result);

// //---------------------------------------------------------------------------------------------------------------------------------------------
