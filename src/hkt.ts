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

export type SetNextArgument<K, T> = SetArgumentAt<K, KArgLength<K>, T>

type GetNextParameter<K> = GetParameterAt<K, KArgLength<K>>

export type TryResolve<K> = 
    K extends KRoot ?
        K['args'] & KRoot<never, never> extends K 
            ? (K & K['args'])['body'] 
            : K
        : K

interface KLeftIdentity extends KRoot {
    readonly 0: unknown
    readonly body: this[0]
}

export type KApp<K, T> = TryResolve<SetNextArgument<K, T>>
export type KApp3<K, A, B> = KApp<KApp<K, A>, B>
export type KApp4<K, A, B, C> = KApp<KApp<KApp<K, A>, B>, C>
export type KAppN<T> = T extends readonly [...infer L, infer R] ? KApp<KAppN<L>, R> : KLeftIdentity

export interface ITypeClass<F> {
    readonly _classParam?: (f: F) => F
}
