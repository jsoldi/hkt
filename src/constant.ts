import { $, $K } from "./hkt.js";
import { IMonoid, monoid } from "./monoid.js";

export type IConstant<A> = IMonoid<$<$K, A>>;

export function constant<A>(value: A): IConstant<A> {
    const get = () => value;
    
    return {
        ...monoid<$<$K, A>>({ empty: get, append: get })
    }
}
