export interface KRoot<Body = unknown> {
    readonly body: Body
}

type ObjectKeys<T> = keyof { [k in keyof Omit<T, symbol> as `${k}`]: T[k] }

type TupleKeys<T> = keyof Omit<T, keyof any[]>

type Constrain<K> = 
    Unwrap<K> extends readonly [infer R, ...infer T] 
        ? T extends { [k in ObjectKeys<R> & TupleKeys<T>]: R[k] } 
            ? unknown
            : never
        : never

export type KType = KRoot | readonly [KType, unknown]

type Unwrap<K> = 
    K extends readonly [infer A, infer B] 
        ? readonly [...Unwrap<A>, B]
        : readonly [K]
        
type Wrap<T> =
    T extends readonly [infer A, infer B, ...infer C]
        ? Wrap<readonly [readonly [A, B], ...C]>
        : T extends readonly [infer A, ...unknown[]]
            ? A
            : never

// export type KApps<K extends KType & Constrain<K>> =
export type KApps<K> =
    Unwrap<K> extends readonly [infer H, ...infer T] 
        ? (T & KRoot<never>) extends H
            ? H extends KRoot 
                ? (H & T)['body']
                : Wrap<[H, ...T]>
            : Wrap<[H, ...T]>
        : K

export type KApp<A, B> = KApps<[A, B]>

export interface ITypeClass<F> {
    readonly _args?: F
}
