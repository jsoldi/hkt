import { $, $I } from "../../core/hkt.js";
import { KThunk, IThunkCore } from "../../types/thunk.js";
import { pipe } from "../../core/utils.js";
import { IContMonad } from "./contMonad.js";
import { cont, Cont } from "./cont.js";
import { KTask } from "../task.js";

export interface IContThunk<F> extends IContMonad<KThunk<F>> {
    lazy<T>(f: () => $<F, Cont<T, KThunk<F>>>): Cont<T, KThunk<F>>
    run<T>(cta: Cont<T, KThunk<F>>): $<F, T>
}

export type ContSync<T> = Cont<T, KThunk<$I>>;
export type ContAsync<T> = Cont<T, KThunk<KTask>>;

export function contThunkOf<F>(m: IThunkCore<F>): IContThunk<F> {
    type I = IContThunk<F>;

    return pipe(
        cont.ofMonad<KThunk<F>>(m),
        base => {
            const lazy: I['lazy'] = f => resolve => m.lazy(() => m.base.map(f(), ct => ct(resolve)));
            const run: I['run'] = cta => m.run(cta(m.unit));

            return {
                ...base,
                lazy,
                run,
            }
        }
    )
}
