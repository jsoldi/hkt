// import { 
//     cont, 
//     maybe, 
//     state, 
//     KTypeOf, 
//     KRoot, 
//     monadPlus, 
//     chain, 
//     lazy 
// } from './index.js';

// // Alias for trampline
// const t = cont.trampoline;

// // Put maybe inside trampoline
// const m = maybe.transform(t);

// // Put trampoline inside state monad
// const s = state.of<string>().transform(m); 

// // Non-higher-kinded parser type
// type Parser<T> = KTypeOf<typeof s, T>; 
// // Parser<T> = (a: string) => Cont<Maybe<[T, string]>, KFree<KLazy>>

// // Higher-kinded parser type
// interface KParser extends KRoot {
//     readonly 0: unknown
//     readonly body: Parser<this[0]>
// }

// const parser = (() => {
//     // Create a monadPlus (monad + monoid) instance for the parser
//     const base = monadPlus<KParser>({ 
//         unit: s.unit,
//         // Suspend the computation of the second parser for lazy evaluation
//         bind: (p, f) => 
//             s.bind(p, a => input => t.suspend(() => f(a)(input))),
//         empty: () => _ => m.empty(),
//         // `append` outputs the first non-empty result
//         // No need to run the second parser if the first one succeeds
//         append: (p1, p2) => input => 
//             m.append(p1(input), t.suspend(() => p2(input)))
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
//     const chainl1 = <A>(
//         p: Parser<A>, 
//         op: Parser<(a: A, b: A) => A>
//     ): Parser<A> => 
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

//     // Numbers and groups parser
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
//     const expr = parser.chainl1(
//         parser.chainl1(
//             group,  // Parse numbers and groups first
//             mulOp   // Then parse multiplication and division
//         ),
//         addOp       // Finally parse addition and subtraction
//     );

//     // Remove whitespace and parse expression
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

// console.log(math.parse('10.1 + 20 * 30 + 40')); // 650.1

// // Trampoline is stack-safe
// console.log(math.parse(
//     Array.from({ length: 10000 }, (_, i) => i).join('+')
// )); // 49995000