import { KRoot } from "./hkt.js"
import { monoid } from "./monoid.js"

export interface KSum extends KRoot {
    readonly 0: unknown
    readonly body: number
}

export const sum = monoid<KSum>({
    empty: () => 0,
    append: (a, b) => a + b
});
