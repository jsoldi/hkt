import { $, $K } from "./hkt.js";
import { IMonoid } from "./monoid.js";

export interface ICollapsible<F, G> {
    collapse<A>(monoid: IMonoid<$<$K, A>>): (fa: $<F, A>) => $<G, A>
}
