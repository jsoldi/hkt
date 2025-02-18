export type TypeClassArg<B, D, S extends symbol> = B & Partial<D> | D & { [k in S]: true };
