export interface KArgs<A = Record<string, unknown>> {
    readonly args: A
}

export interface KRoot<B = unknown, A = Record<string, unknown>> extends KArgs<A> {
    readonly body: B
}

export interface KRoot1 extends KRoot {
    readonly 0: unknown
}

type KArgLength<K, T extends any[] = []> = K extends KArgs<{ readonly [k in T['length']]: unknown }> 
    ? KArgLength<K, [any, ...T]> 
    : T['length']

type SetArgAt<K, I extends number, T> = K & KArgs<{ readonly [k in I]: T }>

type GetParameterAt<K, I> = I extends keyof K ? K[I] : never

type SetArg<K, T> = SetArgAt<K, KArgLength<K>, T>

type Eval<K> = 
    K extends KRoot ?
        K['args'] & KRoot<never, never> extends K 
            ? (K & K['args'])['body'] 
            : K
        : K

// Interfaces below are based on combinatory logic. See ../combinators.md

/* I :: a -> a */

export interface $I extends KRoot1 {
    readonly body: this[0]
}

/* B :: (b -> c) -> (a -> b) -> a -> c */

export interface $B2<_0, _1> extends KRoot1 {
    readonly body: $<_0, $<_1, this[0]>>
}

export interface $B1<_0> extends KRoot1 {
    readonly body: $B2<_0, this[0]>
}

export interface $B extends KRoot1 {
    readonly body: $B1<this[0]>
}

/* Q :: (a -> b) -> (b -> c) -> a -> c */

export interface $Q2<_0, _1> extends KRoot1 {
    readonly body: $<_1, $<_0, this[0]>>
}

export interface $Q1<_0> extends KRoot1 {
    readonly body: $Q2<_0, this[0]>
}

export interface $Q extends KRoot1 {
    readonly body: $Q1<this[0]>
}

/* K :: a -> (b -> a) */

export interface $K1<_0> extends KRoot1 {
    readonly body: _0
}

export interface $K extends KRoot1 {
    readonly body: $K1<this[0]>
}

/* A :: (a -> b) -> a -> b */
export type $<K, T> = Eval<SetArg<K, T>>

export type $3<K, A, B> = $<$<K, A>, B>
export type $4<K, A, B, C> = $<$<$<K, A>, B>, C>
export type $5<K, A, B, C, D> = $<$<$<$<K, A>, B>, C>, D>
export type $N<T> = T extends readonly [...infer L, infer R] ? $<$N<L>, R> : $I

export interface ITypeClass<F> {
    readonly _classArg?: (f: F) => F // when F is * -> *
}

export type KType<M> = M extends ITypeClass<infer F> ? F : never
export type KTypeOf<M, T> = $<KType<M>, T>

// export interface ITypeClass2<F> {
//     readonly _classParam2?: (f: F) => F // when F is * -> * -> *
// }
