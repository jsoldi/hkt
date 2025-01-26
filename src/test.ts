// import { KRoot } from "./hkt.js";
// import { monoid } from "./monoid.js";
// import { id } from "./utils.js";

// export type Endo<T> = (arg: T) => T;

// export interface KEndo extends KRoot {
//     readonly 0: unknown
//     readonly body: Endo<this[0]>
// }

// const endo = (() => {
//     return monoid<KEndo>({
//         empty: () => id,
//         append: (f, g) => x => f(g(x))
//     });
// })();
