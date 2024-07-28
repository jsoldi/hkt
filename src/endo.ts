import { KRoot } from "./hkt.js";
import { monoid } from "./monoid.js";
import { chain, id } from "./utils.js";

export interface KEndo extends KRoot {
    readonly 0: unknown
    readonly body: (a: this[0]) => this[0]
}

export const endo = monoid<KEndo>({ empty: () => id, append: chain });
