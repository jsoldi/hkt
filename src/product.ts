import { KRoot } from "./hkt.js"
import { monoid } from "./monoid.js"

export interface KProduct extends KRoot {
    readonly 0: unknown
    readonly body: number
}

export const product = monoid<KProduct>({
    empty: () => 1,
    append: (a, b) => a * b
});
