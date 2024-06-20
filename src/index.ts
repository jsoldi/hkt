type ID<F> = F

interface IMono<F> {
    // lulz?: F
    a: F extends unknown 
        ? ID<F & { 
            [k in F extends never ? 'heya' : 'heya']: 'WHAT???' 
        }> 
        : unknown
}

interface IDerived extends IMono<{}> { }

declare const fune: <F>(outer: IMono<F>) => F

declare const monito: IDerived

const what = fune(monito);
