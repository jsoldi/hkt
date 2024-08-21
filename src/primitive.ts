import { $, $K } from "./hkt.js";
import { monoid } from "./monoid.js";

export const string = monoid<$<$K, string>>({
    empty: () => "",
    append: (a, b) => a + b
});

export const num = {
    sum: monoid<$<$K, number>>({
        empty: () => 0,
        append: (a, b) => a + b
    }),
    mult: monoid<$<$K, number>>({
        empty: () => 1,
        append: (a, b) => a * b
    })
};

export const bool = {
    or: monoid<$<$K, boolean>>({
        empty: () => false,
        append: (a, b) => a || b
    }),
    and: monoid<$<$K, boolean>>({
        empty: () => true,
        append: (a, b) => a && b
    })
};
