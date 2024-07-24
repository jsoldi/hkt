import { KRoot } from "./hkt.js"
import { monoid } from "./monoid.js"

export interface KNumber extends KRoot {
    readonly 0: unknown
    readonly body: number
}

export const number = monoid<KNumber>({
    empty: () => 0,
    append: (a, b) => a + b
});
