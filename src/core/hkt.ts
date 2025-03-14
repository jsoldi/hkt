interface KArgs<A = Record<string, unknown>> {
    readonly args: A
}

/** Base interface for higher-kinded types */
export interface KRoot<B = unknown, A = Record<string, unknown>> extends KArgs<A> {
    readonly body: B
}

/** Higher-kinded type with 1 type parameter */
export interface KRoot1 extends KRoot {
    readonly 0: unknown
}

type KArgLength<K, T extends any[] = []> = K extends KArgs<{ readonly [k in T['length']]: unknown }> 
    ? KArgLength<K, [any, ...T]> 
    : T['length']

type SetArgAt<K, I extends number, T> = K & KArgs<{ readonly [k in I]: T }>

type SetArg<K, T> = SetArgAt<K, KArgLength<K>, T>

type Eval<K> = 
    K extends KRoot ?
        K['args'] & KRoot<never, never> extends K 
            ? (K & K['args'])['body'] 
            : K
        : K

// Interfaces below are based on combinatory logic. See ../combinators.md

/** I combinator `a -> a` */
export interface $I extends KRoot1 {
    readonly body: this[0]
}

/** B combinator `(b -> c) -> (a -> b) -> a -> c` */
export interface $B2<_0, _1> extends KRoot1 {
    readonly body: $<_0, $<_1, this[0]>>
}

/** B combinator `(b -> c) -> (a -> b) -> a -> c` */
export interface $B1<_0> extends KRoot1 {
    readonly body: $B2<_0, this[0]>
}

/** B combinator `(b -> c) -> (a -> b) -> a -> c` */
export interface $B extends KRoot1 {
    readonly body: $B1<this[0]>
}

/** Q combinator `(a -> b) -> (b -> c) -> a -> c` */
export interface $Q2<_0, _1> extends KRoot1 {
    readonly body: $<_1, $<_0, this[0]>>
}

/** Q combinator `(a -> b) -> (b -> c) -> a -> c` */
export interface $Q1<_0> extends KRoot1 {
    readonly body: $Q2<_0, this[0]>
}

/** Q combinator `(a -> b) -> (b -> c) -> a -> c` */
export interface $Q extends KRoot1 {
    readonly body: $Q1<this[0]>
}

/** K combinator `a -> (b -> a)` */
export interface $K1<_0> extends KRoot1 {
    readonly body: _0
}

/** K combinator `a -> (b -> a)` */
export interface $K extends KRoot1 {
    readonly body: $K1<this[0]>
}

/** Applies a type argument to a higher-kinded type */
export type $<K, T> = Eval<SetArg<K, T>>

/** Applies 2 type arguments to a higher-kinded type */
export type $3<K, A, B> = $<$<K, A>, B>

/** Applies 3 type arguments to a higher-kinded type */
export type $4<K, A, B, C> = $<$<$<K, A>, B>, C>

/** Applies 4 type arguments to a higher-kinded type */
export type $5<K, A, B, C, D> = $<$<$<$<K, A>, B>, C>, D>

/** Applies a list of type arguments to a higher-kinded type */
export type $N<T> = T extends readonly [...infer L, infer R] ? $<$N<L>, R> : $I

/** Base interface for type classes */
export interface ITypeClass<F> {
    readonly _classArg?: (f: F) => F // when F is * -> *
}

/** Extracts the type argument from a type class */
export type KTypeArg<M> = M extends ITypeClass<infer F> ? F : never

/** Extracts the type argument from a type class */
export type TypeArg<M, T> = $<KTypeArg<M>, T>

// export interface ITypeClass2<F> {
//     readonly _classParam2?: (f: F) => F // when F is * -> * -> *
// }
