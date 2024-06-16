/** Represents the type kind `type<_A>` */
export interface HKT<A = unknown> {
    readonly type: unknown 
    readonly _A: A
}

export type Kind<F extends HKT, A> =
    F extends {
        readonly type: unknown
    } ?
    (F & {
        readonly _A: A
    })["type"] :
    {
        readonly _F: F
        readonly _A: A
    }
