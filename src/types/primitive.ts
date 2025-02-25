import { $, $K } from "../core/hkt.js";
import { monoid } from "../classes/monoid.js";
import { semiring } from "../classes/semiring.js";

export const string = monoid<$<$K, string>>({
    empty: () => "",
    append: (a, b) => a + b
});

export const num = semiring<$<$K, number>, $<$K, number>>({
    sum: monoid.concrete(0, (a, b) => a + b),
    mult: monoid.concrete(1, (a, b) => a * b)
});

export const bool = semiring<$<$K, boolean>, $<$K, boolean>>({
    sum: monoid.concrete(false, (a, b) => a || b),
    mult: monoid.concrete(true, (a, b) => a && b)
});
