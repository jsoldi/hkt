interface KArgs<A = {}> {
    readonly args: A
}

export interface KRoot<A = {}, B = unknown> extends KArgs<A> {
    readonly body: B
}

// type KTypeLength<K, T extends any[] = []> = T['length'] extends keyof K ? KTypeLength<K, [unknown, ...T]> : T['length']

type KTypeLength<K> = 
    K extends KArgs<{ readonly 0: unknown }>  ?
    K extends KArgs<{ readonly 1: unknown }>  ?
    K extends KArgs<{ readonly 2: unknown }>  ?
    K extends KArgs<{ readonly 3: unknown }>  ?
    K extends KArgs<{ readonly 4: unknown }>  ?
    K extends KArgs<{ readonly 5: unknown }>  ?
    6 : 5 : 4 : 3 : 2 : 1 : 0

type SetArgumentAt<K, I extends number, T> = K & KArgs<{ readonly [k in I]: T }>

type GetParameterAt<K, I> = I extends keyof K ? K[I] : never

export type SetNextArgument<K, T> = SetArgumentAt<K, KTypeLength<K>, T>

type GetNextParameter<K> = GetParameterAt<K, KTypeLength<K>>

export type TryResolve<K> = 
    K extends KRoot ?
        K['args'] & KRoot<never, never> extends K 
            ? (K & K['args'])['body'] 
            : K
        : K

//export type Param<K> = K extends KRoot ? GetNextParameter<K> : unknown

export type KApp<K, T> = TryResolve<SetNextArgument<K, T>>

export interface ITypeClass<F> {
    readonly _classParam?: (f: F) => F
}
