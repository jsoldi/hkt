import { KRoot } from "./hkt.js";
import { monoid } from "./monoid.js";

export interface KString extends KRoot {
    readonly 0: unknown
    readonly body: string
}

export const string = monoid<KString>({
    empty: () => "",
    concat: (a, b) => a + b
});
