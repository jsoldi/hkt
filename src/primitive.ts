import { $, $K } from "./hkt.js";
import { monoid, monoidFor } from "./monoid.js";

export const string = monoid<$<$K, string>>({
    empty: () => "",
    append: (a, b) => a + b
});

export const num = {
    sum: monoidFor(0, (a, b) => a + b),
    mult: monoidFor(1, (a, b) => a * b)
};

export const bool = {
    or: monoidFor(false, (a, b) => a || b),
    and: monoidFor(true, (a, b) => a && b)
};
