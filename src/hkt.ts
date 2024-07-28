interface KArgs<A = {}> {
    readonly args: A
}

export interface KRoot<B = unknown, A = {}> extends KArgs<A> {
    readonly body: B
}

type KArgLength<K, T extends any[] = []> = K extends KArgs<{ readonly [k in T['length']]: unknown }> 
    ? KArgLength<K, [any, ...T]> 
    : T['length']

type SetArgumentAt<K, I extends number, T> = K & KArgs<{ readonly [k in I]: T }>

type GetParameterAt<K, I> = I extends keyof K ? K[I] : never

type SetNextArgument<K, T> = SetArgumentAt<K, KArgLength<K>, T>

type GetNextParameter<K> = GetParameterAt<K, KArgLength<K>>

type TryResolve<K> = 
    K extends KRoot ?
        K['args'] & KRoot<never, never> extends K 
            ? (K & K['args'])['body'] 
            : K
        : K

export interface $I extends KRoot {
    readonly 0: unknown
    readonly body: this[0]
}

export interface $$ extends KRoot {
    readonly 0: unknown
    readonly 1: unknown
    readonly 2: unknown
    readonly body: $<this[0], $<this[1], this[2]>>
}

export type $<K, T> = TryResolve<SetNextArgument<K, T>>
export type $3<K, A, B> = $<$<K, A>, B>
export type $4<K, A, B, C> = $<$<$<K, A>, B>, C>
export type $5<K, A, B, C, D> = $<$<$<$<K, A>, B>, C>, D>
export type $N<T> = T extends readonly [...infer L, infer R] ? $<$N<L>, R> : $I

export interface ITypeClass<F> {
    // readonly _classParam?: (f: F) => F
}
