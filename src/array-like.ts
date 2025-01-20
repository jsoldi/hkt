import { $ } from "./hkt.js";

export interface IArrayLike<F, G> {
    toArray<A>(fa: $<F, A>): $<G, A[]>
    fromArray<A>(as: $<G, A[]>): $<F, A>
}
