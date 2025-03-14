// import { cont, maybe, state, TypeArg, KRoot, monadPlus, chain, lazy } from "./index.js";

// // alias for trampline
// const t = cont.trampoline;

// // alias for maybe
// const m = maybe.transform(t);

// // put maybe inside a state monad
// const s = state.of<string>().transform(m); 

// // Non-higher-kinded parser type
// type Parser<T> = TypeArg<typeof s, T>; // (a: string) => Maybe<[T, string]>

// // Higher-kinded parser type
// interface KParser extends KRoot {
//     readonly 0: unknown
//     readonly body: Parser<this[0]>
// }

// const parser = (() => {
//     // Create a monadPlus (monad & monoid) instance for the parser
//     const base = monadPlus<KParser>({ 
//         unit: s.unit,
//         // Suspend the computation of the second parser for lazy evaluation
//         bind: (p, f) => s.bind(p, a => input => t.suspend(() => f(a)(input))),
//         empty: () => _ => m.empty(),
//         // No need to run the second parser if the first one succeeds
//         append: (p1, p2) => input => m.append(p1(input), t.suspend(() => p2(input)))
//     });

//     // Next character parser
//     const next: Parser<string> = input => input.length === 0 
//         ? m.empty() 
//         : m.unit([input[0], input.slice(1)]);

//     // Regex parser
//     const regex = (re: RegExp): Parser<string> => (input: string) => {
//         const match = input.match(re);

//         return match === null
//             ? m.empty()
//             : m.unit([match[0], input.slice(match[0].length)]);
//     }

//     // Chain left-associative parser
//     const chainl1 = <A>(p: Parser<A>, op: Parser<(a: A, b: A) => A>): Parser<A> => 
//         base.bind(
//             p,
//             a => base.map(
//                 base.many(
//                     base.bind(
//                         op,
//                         f => base.map(p, b => (x: A) => f(x, b))
//                     )
//                 ),
//                 vs => vs.reduce((a, f) => f(a), a)
//             )
//         );

//     // Character parser
//     const char = (c: string) => base.filter<string>(s => s === c)(next);

//     return { ...base, next, regex, chainl1, char }
// })();

// const math = (() => {
//     // Number parser
//     const num = parser.map(parser.regex(/^\d+(\.\d+)?/), parseFloat);

//     // Addition and subtraction parser
//     const addOp = parser.append(
//         parser.map(parser.char('+'), _ => (a: number, b: number) => a + b),
//         parser.map(parser.char('-'), _ => (a: number, b: number) => a - b)
//     );

//     // Multiplication and division parser
//     const mulOp = parser.append(
//         parser.map(parser.char('*'), _ => (a: number, b: number) => a * b),
//         parser.map(parser.char('/'), _ => (a: number, b: number) => a / b)
//     );

//     // Bracketed expression parser
//     const group: Parser<number> = parser.append(
//         num,
//         parser.pipe(
//             parser.char('('),
//             _ => expr,
//             _ => parser.char(')'),
//             (_, n) => parser.unit(n)
//         )
//     );

//     // Arithmetic expression parser
//     const expr = parser.chainl1(parser.chainl1(group, mulOp), addOp);

//     // Final parser
//     const parse = chain(
//         (s: string) => s.replace(/\s/g, ''), 
//         expr, 
//         m.fmap(([n]) => n),
//         m.else(() => t.unit('Invalid expression')),
//         t.run,
//         lazy.run
//     );

//     return { ...parser, num, addOp, mulOp, group, expr, parse }
// })();

// const aver = Array.from({ length: 4 }, (_, i) => i).join('+');
// const result = math.parse('10.1 + 20 * 30 + 40'); // 650.1
// console.log(result);
