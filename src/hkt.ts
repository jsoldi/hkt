interface KArgs<out A = {}> {
    readonly args: A
}

export interface KRoot<out A = {}, out B = unknown> extends KArgs<A> {
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

interface KLeftIdentity extends KRoot {
    readonly 0: unknown
    readonly body: this[0]
}

export type KApp<K, T> = TryResolve<SetNextArgument<K, T>>

export type KApps<T> = T extends readonly [...infer L, infer R] ? KApp<KApps<L>, R> : KLeftIdentity

export interface ITypeClass<F> {
    readonly _classParam?: (f: F) => F
}

type Clone<T> = { readonly [k in keyof T]: () => T[k] }

export type TryResolve2<K extends KRoot & { readonly 0: unknown } & KArgs<{ readonly 0: unknown }>> = 
    K[0] extends K['args'][0] 
        ? never 
        : unknown

function veamos<G extends KRoot & { readonly 0: unknown } & KArgs<{ readonly 0: unknown }>, S extends G>(g: TryResolve2<G>, s: TryResolve2<S>) {
    g = s;
    s = g;
}
