import { IFoldBase, IFold, fold } from "./fold.js";
import { IFunctorBase } from "./functor.js";
import { $, $I, $B2, $Q2 } from "../core/hkt.js";
import { IMonadBase, ITrivial, monad, trivial } from "./monad.js";
import { TypeClassArg } from "./utilities.js";
import { chain, pipe } from "../core/utils.js";

export interface IFoldableBase<F> extends IFunctorBase<F> {
    foldl<A, B>(f: (b: B, a: A) => B): (b: B) => (fa: $<F, A>) => B
}

export interface IFoldable<F> extends IFoldableBase<F>, IFold<F, $I> {
    readonly scalar: ITrivial;
    liftFoldOver<M>(m: IMonadBase<M>): IFold<$B2<F, M>, M>
    liftFoldUnder<M>(m: IMonadBase<M>): IFold<$Q2<F, M>, M>
    nestFold<M, N>(m: IFoldBase<M, N>): IFold<$B2<F, M>, N>
}

const is_foldable = Symbol("is_foldable");

export function foldable<F>(base: TypeClassArg<IFoldableBase<F>, IFoldable<F>, typeof is_foldable>): IFoldable<F> {
    if (is_foldable in base)
        return base;

    return pipe(
        base,
        base => ({
            ...fold<F, $I>({
                scalar: trivial,
                ...base,
            }),
            scalar: trivial,
            ...base
        }),
        base => {        
            /** Passed monad must transform from $<M, T> to $<G, $<M, T>> given G */
            const liftFoldOver = <M>(m: IMonadBase<M>) => {
                const _m = monad<M>(m);

                return fold<$B2<F, M>, M>({
                    map: (fma, f) => base.map(fma, _m.fmap(f)),
                    scalar: _m, //: m.transform(base.scalar),
                    foldl: f => b => base.foldl(_m.lift2(f))(_m.unit(b)),
                });
            }

            /** Passed monad must transform from $<M, T> to $<M, $<G, T>> given G */
            const liftFoldUnder = <M>(m: IMonadBase<M>) => {
                const _m = monad<M>(m);

                return fold<$Q2<F, M>, M>({
                    map: (fa, f) => _m.map(fa, base.fmap(f)),
                    scalar: _m, //: m.transform(base.scalar),
                    foldl: f => b => _m.fmap(base.foldl(f)(b))
                });
            }

            const nestFold = <M, N>(m: IFoldBase<M, N>) => {
                return fold<$B2<F, M>, N>({
                    map: (fa, f) => base.map(fa, ma => m.map(ma, f)),
                    foldl: f => chain(
                        m.scalar.unit, 
                        base.foldl((nb, ma) => m.scalar.bind(nb, b2 => m.foldl(f)(b2)(ma)))
                    ),                        
                    scalar: m.scalar
                });
            }

            return {
                [is_foldable]: true,
                nestFold,
                liftFoldOver,
                liftFoldUnder,
                ...base
            }
        }
    )
}
