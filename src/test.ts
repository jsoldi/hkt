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

// // alias for trampline
// const t = cont.trampoline;

// // put maybe inside trampline
// const m = maybe.transform(t);

// // put maybe inside state monad
// const s = state.of<string>().transform(m); 

// // Non-higher-kinded parser type
// type Parser<T> = KTypeOf<typeof s, T>; // (a: string) => Cont<Maybe<[T, string]>, KFree<KLazy>>
