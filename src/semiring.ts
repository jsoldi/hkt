import { IMonoid } from "./monoid.js";

export interface ISemiring<F> {
    readonly sum: IMonoid<F>
    readonly mult: IMonoid<F>
}
