// import { IMonad } from "./classes/monad.js";
// import { $ } from "./core/hkt.js";
// import { Lazy } from "./types/lazy.js";

// type Parser<T> = (input: string) => [T, string] | null;

// type ConsList<T> = Lazy<null | { head: T, tail: ConsList<T> }>;

// type ShitList<M, T> = $<M, null | { head: T, tail: ShitList<M, T> }>;

// const toArray = <M, T>(m: IMonad<M>, list: ShitList<M, T>): $<M, T[]> => {
//     return m.bind(list, 
//         x => x === null ? m.unit([]) : m.map(toArray(m, x.tail), xs => [x.head, ...xs])
//     );
// }

// const list = (() => {
//     const empty = <A>(): ConsList<A> => () => null;

//     const cons = <A>(head: A, tail: ConsList<A>): ConsList<A> => () => ({ head, tail });

    

//     return {
//         empty,
//         cons,
//     }
// })();

// const parser = (() => {
//     const unit = <A>(a: A): Parser<A> => input => [a, input];

//     const bind = <A, B>(bp: Parser<A>, fb: (a: A) => Parser<B>): Parser<B> => (input: string) => {
//         const pair = bp(input);
//         return pair === null ? null : fb(pair[0])(pair[1]);
//     }

//     const map = <A, B>(mp: Parser<A>, fm: (a: A) => B): Parser<B> => (input: string) => {
//         const pair = mp(input);
//         return pair === null ? null : [fm(pair[0]), pair[1]];
//     }

//     const append = <A>(p1: Parser<A>, p2: Parser<A>): Parser<A> => (input: string) => {
//         return p1(input) ?? p2(input);
//     }

//     const some3 = <A>(bp: Parser<A>): Parser<ConsList<Parser<A>>> => {
//         return bind(bp, a => {

//             //const result = unit(list.cons())

//             const rekt = map(append(some3(bp), unit(list.empty())), as => list.cons(unit(a), as));
//         });
//     }

//     const some2 = <A>(bp: Parser<A>): Parser<A[]> => {
//         return bind(bp, a => map(append(some2(bp), unit([])), as => [a, ...as]));
//     }

//     const some = <A>(bp: Parser<A>): Parser<A[]> => {
//         function fb(a: A): Parser<A[]> {    
//             return (input: string) => { // 3
//                 const pair = some_v(input) ?? [[], input]; // 4 -> 1
//                 return pair === null ? null : [[a, ...pair[0]], pair[1]];
//             }
//         };

//         function some_v(input: string): [A[], string] | null { // 1
//             const pair = bp(input);
//             return pair === null ? null : fb(pair[0])(pair[1]); // 2
//         };

//         return some_v; // 0
//     }

//     return { some };
// })();

// let digit = 0;
// const nextDigit = () => (digit++ % 10).toString();
// const digits = Array.from({ length: 50000 }, nextDigit).join('');

// const test = parser.some(parser.regex(/^\d/));
// const result = test(digits + 'rest');
// console.log(result);

// //---------------------------------------------------------------------------------------------------------------------------------------------
