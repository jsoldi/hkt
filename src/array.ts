import { KRoot } from "./hkt.js";
import { monad } from "./monad.js";
import { ITransMonad, transformer } from "./transformer.js";

export interface KArray extends KRoot {
    readonly 0: unknown
    readonly body: Array<this[0]>
}

interface IArray extends ITransMonad<KArray> {
    filter: {
        <T, S extends T>(predicate: (item: T) => item is S): (items: T[]) => S[];
        <T>(predicate: (item: T) => boolean): (items: T[]) => T[];
    }
}

export const array: IArray = (() => {
    const m = monad<KArray>({ 
        unit: a => [a], 
        bind: (fa, f) => fa.flatMap(f) 
    });

    const filter: {
        <T, S extends T>(predicate: (item: T) => item is S): (items: T[]) => S[];
        <T>(predicate: (item: T) => boolean): (items: T[]) => T[];
    } = <T, S extends T>(predicate: (item: T) => any): (items: T[]) => T[] | S[] => {
        return (items: T[]) => items.filter(predicate);
    };    

    const transform = transformer<KArray>(m, outer => (fa, f) => 
        outer.bind(fa, ae => outer.map(outer.sequence(ae.map(f)), a => a.flat()))
    );

    return { ...m, filter, transform };
})();
