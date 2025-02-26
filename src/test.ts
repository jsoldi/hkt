// import { monad } from "./classes/monad.js";
// import { monadPlus } from "./classes/monadPlus.js";
// import { KRoot, KTypeOf } from "./core/hkt.js";
// import { id } from "./core/utils.js";
// import { cont } from "./types/cont/cont.js";
// import { free, Free } from "./types/free/free.js";
// import { Lazy, lazy } from "./types/lazy.js";

// type Parser<T> = (input: string) => [T, string] | null;

// interface KParser extends KRoot {
//     readonly 0: unknown
//     readonly body: Parser<this[0]>
// }

// const parser = (() => {
//     const unit = <A>(a: A): Parser<A> => input => [a, input];

//     const lazy = <A>(a: Lazy<Parser<A>>): Parser<A> => input => a()(input);

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
//         regex,
//         lazy
//     }
// })();

// const freeParser = free.ofMonad(parser);
// const sync = cont.ofMonadFree(freeParser);
// type Sync<A> = KTypeOf<typeof sync, A>;

// const someme = <A>(p: Parser<A>): Parser<A[]> => {
//     return input => {
//         const first = p(input);

//         if (first === null) 
//             return null;

//         const input2 = first[1];
//         const other = someme(p);
//         const next1 = other(input2);
//         const second = next1 !== null ? next1 : [[], input2] as [A[], string];
//         return second === null ? null : [[first[0], ...second[0]], second[1]];
//     }
// }

// const tramp = cont.trampoline;
// type Tramp<A> = KTypeOf<typeof tramp, A>;
// // const lols: Cont<[A[], string] | null, KFree<KLazy>>
// // type Tramp<A> = <R>(resolve: (t: A) => Free<R, KLazy>) => Free<R, KLazy>

// const shite = <A>(p: Parser<A>) => (input: string): Tramp<[A[], string] | null> => {
//     const first = p(input);

//     if (first === null) 
//         return tramp.unit(null);

//     const input2 = first[1];
//     const next1Cont = tramp.suspend(() => shite(p)(input2));

//     return tramp.map(
//         next1Cont,
//         next1 => {
//             const second = next1 !== null ? next1 : [[], input2] as [A[], string];
//             return second === null ? null : [[first[0], ...second[0]], second[1]];
//         }
//     )
// }

// const shite2 = <A>(p: Parser<A>) => (input: string): Tramp<(lol: number) => [A[], string] | null> => {
//     const first = p(input);

//     if (first === null) 
//         return tramp.unit(_lol => null);

//     const input2 = first[1];
//     const next1Cont = tramp.suspend(() => shite2(p)(input2));

//     return tramp.map(
//         next1Cont,
//         lele => {
//             const next1 = lele(0);
//             const second = next1 !== null ? next1 : [[], input2] as [A[], string];
//             return _lol => second === null ? null : [[first[0], ...second[0]], second[1]];
//         }
//     )
// }

// const someme2 = <A>(p: Parser<A>): Parser<A[]> => {
//     return input => {
//         const lel = shite2(p)(input);
//         return tramp.drop(lel)()(123);
//     };
// }

// let digit = 0;
// const nextDigit = () => (digit++ % 10).toString();
// const digits = Array.from({ length: 10000 }, nextDigit).join('');

// const test = someme2(parser.regex(/^\d/));
// const result = test(digits + 'rest');

// // const test = some(sync.lift(() => parser.regex(/^\d/)));
// // const result = sync.drop(test)()(digits + 'rest');

// console.log(result);

// //---------------------------------------------------------------------------------------------------------------------------------------------
