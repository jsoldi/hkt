import { $, $3, $4 } from "./core/hkt";

export type Exists<P> = <A>(fun: <X>(p: $<P, X>) => A) => A;
export type Exists2<P> = <A>(fun: <X1, X2>(p: $3<P, X1, X2>) => A) => A;
export type Exists3<P> = <A>(fun: <X1, X2, X3>(p: $4<P, X1, X2, X3>) => A) => A;

