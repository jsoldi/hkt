import { $ } from "../../core/hkt.js";
import { pipe } from "../../core/utils.js";
import { KFree } from "../free/functorFree.js";
import { IMonadFree } from "../free/monadFree.js";
import { Cont } from "./contCore.js";
import { contFunctorFree, IContFunctorFree } from "./contFunctorFree.js";

export interface IContMonadFree<F> extends IContFunctorFree<F> {
    readonly contMonad: IMonadFree<F>
    run<A>(cta: Cont<A, KFree<F>>): $<F, A>
}

export function contMonadFree<F>(m: IMonadFree<F>): IContMonadFree<F> {
    type I = IContMonadFree<F>;

    return pipe(
        contFunctorFree<F>(m),
        base => {
            const run: I['run'] = cta => m.run(cta(m.unit));

            return {
                ...base,
                contMonad: m,
                run
            }
        }
    )
}
