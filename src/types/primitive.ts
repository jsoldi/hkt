import { $, $K } from "../core/hkt.js";
import { monoid } from "../classes/monoid.js";
import { semiring } from "../classes/semiring.js";

/** The monoid for strings having the empty string as the identity element and string concatenation as the binary operation. */
export const string = monoid<$<$K, string>>({
    empty: () => "",
    append: (a, b) => a + b
});

/** The number semiring for arithmetic addition and multiplication. */
export const num = semiring<$<$K, number>, $<$K, number>>({
    sum: monoid.concrete(0, (a, b) => a + b),
    mult: monoid.concrete(1, (a, b) => a * b)
});

/** The boolean semiring having OR as addition and AND as multiplication. */
export const bool = semiring<$<$K, boolean>, $<$K, boolean>>({
    sum: monoid.concrete(false, (a, b) => a || b),
    mult: monoid.concrete(true, (a, b) => a && b)
});
