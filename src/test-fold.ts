// import { IMonad, monad } from "./classes/monad.js";
// import { $, $I, KRoot } from "./core/hkt.js";
// import { array, KArray } from "./types/array.js";
// import { Cont, cont } from "./types/cont/cont.js";
// import { KFree, Free, thunk } from "./types/thunk.js";

// type Parser<T> = (input: string) => [T, string] | null;

// interface KParser extends KRoot {
//     readonly 0: unknown
//     readonly body: Parser<this[0]>
// }

// // const lel = cont.thunkSync.transformThunk(array);
// // const aa = lel.lift([1000, 2000, 3000]);
// // const telas = lel.bind(aa, a => lel.lift([a + 1, a + 2]));
// // let tara = telas(lel.contMonad.unit);
// // const shite = lel.contMonad.fold(array)(tara);
// // console.log(shite);

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

//     const some = <A>(bp: Parser<A>): Parser<A[]> => {
//         return bind(bp, a => {
//             return map(append(some(bp), unit([])), as => [a, ...as]);
//         });

//         // function fb(a: A): Parser<A[]> {    
//         //     return (input: string) => { // 3
//         //         const pair = some_v(input) ?? [[], input]; // 4 -> 1
//         //         return pair === null ? null : [[a, ...pair[0]], pair[1]];
//         //     }
//         // };

//         // function some_v(input: string): [A[], string] | null { // 1
//         //     const pair = bp(input);
//         //     return pair === null ? null : fb(pair[0])(pair[1]); // 2
//         // };

//         // return some_v; // 0
//     }

//     const append = <A>(p1: Parser<A>, p2: Parser<A>): Parser<A> => (input: string) => {
//         return p1(input) ?? p2(input);
//     }

//     const regex = (re: RegExp): Parser<string> => (input: string) => {
//         const match = input.match(re);
//         return match === null ? null : [match[0], input.slice(match[0].length)];
//     }

//     return {
//         ...monad<KParser>({ unit, bind, map }),
//         regex,
//         some,
//         append,
//     };
// })();

// const pm = cont.of<KParser>().transform2(parser); // Cont<Parser<T>, KParser>
// type CParser<T> = Cont<Parser<T>, KParser>;

// const somes = <A>(p1: CParser<A>): CParser<A[]> => {
//     return pm.bind(p1, a => {
//         return pm.bind(cappend(somes(p1), pm.unit([])), as => pm.unit([a, ...as]));
//     });
// }

// const cappend = <A>(p1: CParser<A>, p2: CParser<A>): CParser<A> => {
//     return resolve => {
//         return p1(a => p2(b => resolve(input => a(input) ?? b(input))));
//     }
// }

// // let digit = 0;
// // const nextDigit = () => (digit++ % 10).toString();
// // const digits = Array.from({ length: 12 }, nextDigit).join('');
// // const text = digits + 'rest';
// // console.log('text:', text);
// // const p = parser.regex(/^\d/);

// // const test = somes(pm.lift(p));
// // const result = pm.drop(test)(text);
// // console.log(result);

// // const test = parser.some(p);
// // const result = test(text);
// // console.log(result);

// //--------------------------------------------------------------

// function help<M>(m: IMonad<M>) {
//     const base = cont.of<M>();

//     const lift = <A>(ma: $<M, A>): Cont<A, M> => 
//         resolve => m.bind(ma, resolve);
    
//     const drop = <A>(ca: Cont<A, M>): $<M, A> =>
//         ca(m.unit);

//     return { lift, drop };
// }

// const base = thunk.of<KArray>(array);

// const fib = (n: bigint): Free<bigint, KArray> => {
//     if (n < 2)
//         return base.unit(n);



//     return base.suspend(() => [
//         fib(n - 1n),
//         fib(n - 2n)
//     ]);
// };

// let depth = 0;
// let maxDepth = 0;

// const count = (n: bigint): Free<bigint, KArray> => {
//     try {
//         depth++;
//         maxDepth = Math.max(maxDepth, depth);

//         if (n < 2n) {
//             return base.unit(n);
//         } else {
//             return base.suspend(() => [
//                 base.unit(1n),
//                 count(n - 1n)
//             ]);
//         }
//     } finally {
//         depth--;
//     }
// }

// type Tree<A> = { leaf: true, value: A } | { leaf: false, children: Tree<A>[] };

// function tree<A>(t: Free<A, KArray>): Tree<A> {
//     if (t.right) {
//         const next = t.value();
//         const children = next.map(tree);
//         return { leaf: false, children };
//     } else {
//         return { leaf: true, value: t.value };
//     }
// }

// function showTree<A>(t: Tree<A>): string {
//     if (t.leaf) {
//         return String(t.value);
//     } else {
//         return `[${t.children.map(showTree).join(', ')}]`;
//     }
// }

// // const tr = tree(base.map(lel, t => Number(t)));
// // console.log('tree', showTree(tr));

// const foldCont = <A>(t: Free<A, KArray>): A[] => {
//     const cfold = <A>(t: Free<A, KArray>): <R>(resolve: (a: A) => R[]) => R[] => {
//         if (t.right) {
//             return resolve => {
//                 return t.value().flatMap(t2 => cfold(t2)(resolve));
//             }
//         } else {
//             return resolve => resolve(t.value);
//         }
//     }
    
//     return cfold(t)(a => [a]);
// }

// export type FlatThunk<A, B> = { right: false, value: A } | { right: true, value: () => B };
// export type ArrayThunk<A> = { right: false, value: A } | { right: true, value: () => ArrayThunk<A>[] };

// const shite = <A>(t: Free<A, KArray>): Free<A, $I>[] => {
//     if (t.right) {
//         const thunks = t.value();


//         const tele = thunks.flatMap((t: Free<A, KArray>): Free<A, $I>[] => {
//             if (t.right) {
//                 const thunks = t.value();
        
//                 const tele = thunks.flatMap(t => {
//                     return shite(t);
//                 });
        
//                 throw new Error();
//             } else {
//                 return [{ right: false, value: t.value }];
//             }
//         });

//         return tele;
//     } else {
//         return [{ right: false, value: t.value }];
//     }
// }

// const foldRec = <A>(t: ArrayThunk<A>): A[] => {
//     if (t.right) {
//         return t.value().flatMap(foldRec);
//     } else {
//         return [t.value];
//     }
// }

// const foldShit = <A>(t: Free<A, KArray>): Free<A, $I> => {
//     const thid = thunk.of<$I>(monad.trivial);
//     const thar = thunk.of<KArray>(array);

//     return thid.mapThunk2<KArray, A>((ft: Free<A, KArray>[]): Free<A, KArray> => {
//         const avere = ft.flatMap(t => {
//             return null as any as Free<A, KArray>[];
//         });

//         return thar.suspend(() => ft);
//     })(t);
// }

// type Shite<A> = Cont<A, KFree<KArray>>;
// type Aver = Shite<string>

// const tar = thunk.of(array);

// // const cfold = <A>(t: Thunk<A, KArray>): (<R>(resolve: (a: A) => Thunk<R, KArray>) => Thunk<R, KArray>) => {
// //     if (t.right) {
// //         return <R>(resolve: (a: A) => Thunk<R, KArray>): Thunk<R, KArray> => {
// //             return tar.suspend(() => t.value().flatMap(t2 => {
// //                 const ple: Cont<A, KThunk<KArray>> = cfold(t2);
// //                 return ple(resolve);
// //             }));
// //         }
// //     } else {
// //         return <R>(resolve: (a: A) => Thunk<R, KArray>): Thunk<R, KArray> => {
// //             const res: Thunk<R, KArray> = resolve(t.value);
// //             return res;
// //         }
// //     }
// // }

// const input = 4n;
// console.log('input', input);

// const lel = count(input);

// // const tr = tree(lel);
// // const ver = showTree(tr);
// // console.log('tree', ver);

// let res = foldShit(lel);

// while (res.right) {
//     console.log('trying');
//     res = res.value();
// }

// console.log('all', res.value);

// // const res = foldRec(lel);
// // console.log(res);
// // const sum = res.reduce((acc, n) => acc + n, 0n);

// // console.log('sum', sum);
// // console.log('maxDepth', maxDepth);

// //--------------------------------------------------------------

// // const append = <A>(p1: Parser<A>, p2: Parser<A>): Parser<A> => (input: string) => {
// //     return p1(input) ?? p2(input);
// // }

// // const some3 = <A>(bp: Parser<A>): Parser<ConsList<Parser<A>>> => {
// //     return bind(bp, a => {

// //         //const result = unit(list.cons())

// //         const rekt = map(append(some3(bp), unit(list.empty())), as => list.cons(unit(a), as));
// //     });
// // }

// // const some2 = <A>(bp: Parser<A>): Parser<A[]> => {
// //     return bind(bp, a => map(append(some2(bp), unit([])), as => [a, ...as]));
// // }

// // const some = <A>(bp: Parser<A>): Parser<A[]> => {
// //     function fb(a: A): Parser<A[]> {    
// //         return (input: string) => { // 3
// //             const pair = some_v(input) ?? [[], input]; // 4 -> 1
// //             return pair === null ? null : [[a, ...pair[0]], pair[1]];
// //         }
// //     };

// //     function some_v(input: string): [A[], string] | null { // 1
// //         const pair = bp(input);
// //         return pair === null ? null : fb(pair[0])(pair[1]); // 2
// //     };

// //     return some_v; // 0
// // }