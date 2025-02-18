import { $, $K } from "../core/hkt.js";
import { monoid, monoidFor } from "../classes/monoid.js";
import { semiring } from "../classes/semiring.js";

export const string = monoid<$<$K, string>>({
    empty: () => "",
    append: (a, b) => a + b
});

export const num = semiring<$<$K, number>, $<$K, number>>({
    sum: monoidFor(0, (a, b) => a + b),
    mult: monoidFor(1, (a, b) => a * b)
});

export const bool = semiring<$<$K, boolean>, $<$K, boolean>>({
    sum: monoidFor(false, (a, b) => a || b),
    mult: monoidFor(true, (a, b) => a && b)
});
