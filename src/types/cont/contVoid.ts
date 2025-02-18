import { $K1 } from "../../core/hkt.js";
import { pipe } from "../../core/utils.js";
import { cont, Cont, IContCore } from "./cont.js";

export interface IContVoid extends IContCore<$K1<void>> {
    sleep(delay?: number): Cont<void, $K1<void>>
}

export type ContVoid<T> = Cont<T, $K1<void>>;

export function contVoid(): IContVoid {
    type I = IContVoid

    return pipe(
        cont.of<$K1<void>>(),
        base => {
            const sleep: I['sleep'] = (delay = 0) => resolve => { setTimeout(resolve, delay) };

            return {
                ...base,
                sleep
            }
        }
    )
}
