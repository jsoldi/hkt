interface Args<out A> {
    readonly args: A
}

interface Body<out B> {
    readonly body: B
}

interface Root<out A, out B> extends Args<A>, Body<B> { }

export interface KRoot extends Root<{}, unknown> { }

// type KTypeLength<K, T extends any[] = []> = T['length'] extends keyof K ? KTypeLength<K, [unknown, ...T]> : T['length']

type KTypeLength<K extends {}> = 
    K extends { readonly 0: unknown }  ?
    K extends { readonly 1: unknown }  ?
    K extends { readonly 2: unknown }  ?
    K extends { readonly 3: unknown }  ?
    K extends { readonly 4: unknown }  ?
    K extends { readonly 5: unknown }  ?
    unknown : 5 : 4 : 3 : 2 : 1 : 0

type SetArgumentAt<K, I extends number, T> = K & Args<{ readonly [k in I]: T }>

type GetParameterAt<K extends KRoot, I extends keyof any> = I extends keyof K ? K[I] : never

export type SetNextArgument<K extends Args<{}>, T> = SetArgumentAt<K, KTypeLength<K['args']>, T>

type GetNextParameter<K extends KRoot> = GetParameterAt<K, KTypeLength<K['args']>>

export type TryResolve<K extends KRoot> = K['args'] & Root<never, never> extends K ? (K & K['args'])['body'] : K

//export type Param<K> = K extends KRoot ? GetNextParameter<K> : unknown

export type KApp<K, T> = K extends KRoot ? TryResolve<SetNextArgument<K, T>> : unknown

export interface ITypeClass<F> {
    readonly _classParam?: (f: F) => void
}
