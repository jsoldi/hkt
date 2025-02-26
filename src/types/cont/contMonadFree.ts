import { $ } from "../../core/hkt.js";
import { pipe } from "../../core/utils.js";
import { KFree } from "../free/functorFree.js";
import { IMonadFree } from "../free/monadFree.js";
import { Cont } from "./contCore.js";
import { contFunctorFree, IContFunctorFree } from "./contFunctorFree.js";

export interface IContMonadFree<F> extends IContFunctorFree<F> {
    readonly contMonad: IMonadFree<F>
    drop<A>(cta: Cont<A, KFree<F>>): $<F, A> // TODO: Call it run I think
}

export function contMonadFree<F>(m: IMonadFree<F>): IContMonadFree<F> {
    type I = IContMonadFree<F>;

    return pipe(
        contFunctorFree<F>(m),
        base => {
            const drop: I['drop'] = cta => m.drop(cta(m.unit));

            return {
                ...base,
                contMonad: m,
                drop
            }
        }
    )
}
