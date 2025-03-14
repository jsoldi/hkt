function _chain(...fs: ((...a: any[]) => any)[]): (a: any) => any {
    return fs.reduce((acc, f) => (a: any) => f(acc(a)), id);
}

/** Chains multiple functions together, passing the result of each function to the next. */
export function chain<A>(): (a: A) => A
/** Chains multiple functions together, passing the result of each function to the next. */
export function chain<A, B>(f: (...a: [A]) => B): (a: A) => B
/** Chains multiple functions together, passing the result of each function to the next. */
export function chain<A, B, C>(f: (...a: [A]) => B, g: (...b: [B, A]) => C): (a: A) => C
/** Chains multiple functions together, passing the result of each function to the next. */
export function chain<A, B, C, D>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D): (a: A) => D
/** Chains multiple functions together, passing the result of each function to the next. */
export function chain<A, B, C, D, E>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E): (a: A) => E
/** Chains multiple functions together, passing the result of each function to the next. */
export function chain<A, B, C, D, E, G>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E, j: (...e: [E, D, C, B, A]) => G): (a: A) => G
/** Chains multiple functions together, passing the result of each function to the next. */
export function chain<A, B, C, D, E, G, H>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E, j: (...e: [E, D, C, B, A]) => G, k: (...f: [G, E, D, C, B, A]) => H): (a: A) => H
/** Chains multiple functions together, passing the result of each function to the next. */
export function chain<A, B, C, D, E, G, H, I>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E, j: (...e: [E, D, C, B, A]) => G, k: (...f: [G, E, D, C, B, A]) => H, l: (...g: [H, G, E, D, C, B, A]) => I): (a: A) => I
/** Chains multiple functions together, passing the result of each function to the next. */
export function chain<A, B, C, D, E, G, H, I, J>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E, j: (...e: [E, D, C, B, A]) => G, k: (...f: [G, E, D, C, B, A]) => H, l: (...g: [H, G, E, D, C, B, A]) => I, m: (...h: [I, H, G, E, D, C, B, A]) => J): (a: A) => J
/** Chains multiple functions together, passing the result of each function to the next. */
export function chain<A, B, C, D, E, G, H, I, J, K>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E, j: (...e: [E, D, C, B, A]) => G, k: (...f: [G, E, D, C, B, A]) => H, l: (...g: [H, G, E, D, C, B, A]) => I, m: (...h: [I, H, G, E, D, C, B, A]) => J, n: (...i: [J, I, H, G, E, D, C, B, A]) => K): (a: A) => K
/** Chains multiple functions together, passing the result of each function to the next. */
export function chain<A, B, C, D, E, G, H, I, J, K, L>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E, j: (...e: [E, D, C, B, A]) => G, k: (...f: [G, E, D, C, B, A]) => H, l: (...g: [H, G, E, D, C, B, A]) => I, m: (...h: [I, H, G, E, D, C, B, A]) => J, n: (...i: [J, I, H, G, E, D, C, B, A]) => K, o: (...j: [K, J, I, H, G, E, D, C, B, A]) => L): (a: A) => L
/** Chains multiple functions together, passing the result of each function to the next. */
export function chain<A, B, C, D, E, G, H, I, J, K, L, M>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E, j: (...e: [E, D, C, B, A]) => G, k: (...f: [G, E, D, C, B, A]) => H, l: (...g: [H, G, E, D, C, B, A]) => I, m: (...h: [I, H, G, E, D, C, B, A]) => J, n: (...i: [J, I, H, G, E, D, C, B, A]) => K, o: (...j: [K, J, I, H, G, E, D, C, B, A]) => L, p: (...k: [L, K, J, I, H, G, E, D, C, B, A]) => M): (a: A) => M
/** Chains multiple functions together, passing the result of each function to the next. */
export function chain(...fs: ((...a: any[]) => any)[]): (a: any) => any {
    return _chain(...fs);
}

function _pipe(a: any, ...fs: ((...a: any[]) => any)[]): any {
    return _chain(...fs)(a);
}

/** Pipes a value through multiple functions, passing the result of each function to the next. */
export function pipe<A>(a: A): A
/** Pipes a value through multiple functions, passing the result of each function to the next. */
export function pipe<A, B>(a: A, f: (...a: [A]) => B): B
/** Pipes a value through multiple functions, passing the result of each function to the next. */
export function pipe<A, B, C>(a: A, f: (...a: [A]) => B, g: (...a: [B, A]) => C): C
/** Pipes a value through multiple functions, passing the result of each function to the next. */
export function pipe<A, B, C, D>(a: A, f: (...a: [A]) => B, g: (...a: [B, A]) => C, h: (...a: [C, B, A]) => D): D
/** Pipes a value through multiple functions, passing the result of each function to the next. */
export function pipe<A, B, C, D, E>(a: A, f: (...a: [A]) => B, g: (...a: [B, A]) => C, h: (...a: [C, B, A]) => D, i: (...a: [D, C, B, A]) => E): E
/** Pipes a value through multiple functions, passing the result of each function to the next. */
export function pipe<A, B, C, D, E, G>(a: A, f: (...a: [A]) => B, g: (...a: [B, A]) => C, h: (...a: [C, B, A]) => D, i: (...a: [D, C, B, A]) => E, j: (...a: [E, D, C, B, A]) => G): G
/** Pipes a value through multiple functions, passing the result of each function to the next. */
export function pipe<A, B, C, D, E, G, H>(a: A, f: (...a: [A]) => B, g: (...a: [B, A]) => C, h: (...a: [C, B, A]) => D, i: (...a: [D, C, B, A]) => E, j: (...a: [E, D, C, B, A]) => G, k: (...a: [G, E, D, C, B, A]) => H): H
/** Pipes a value through multiple functions, passing the result of each function to the next. */
export function pipe<A, B, C, D, E, G, H, I>(a: A, f: (...a: [A]) => B, g: (...a: [B, A]) => C, h: (...a: [C, B, A]) => D, i: (...a: [D, C, B, A]) => E, j: (...a: [E, D, C, B, A]) => G, k: (...a: [G, E, D, C, B, A]) => H, l: (...a: [H, G, E, D, C, B, A]) => I): I
/** Pipes a value through multiple functions, passing the result of each function to the next. */
export function pipe<A, B, C, D, E, G, H, I, J>(a: A, f: (...a: [A]) => B, g: (...a: [B, A]) => C, h: (...a: [C, B, A]) => D, i: (...a: [D, C, B, A]) => E, j: (...a: [E, D, C, B, A]) => G, k: (...a: [G, E, D, C, B, A]) => H, l: (...a: [H, G, E, D, C, B, A]) => I, m: (...a: [I, H, G, E, D, C, B, A]) => J): J
/** Pipes a value through multiple functions, passing the result of each function to the next. */
export function pipe<A, B, C, D, E, G, H, I, J, K>(a: A, f: (...a: [A]) => B, g: (...a: [B, A]) => C, h: (...a: [C, B, A]) => D, i: (...a: [D, C, B, A]) => E, j: (...a: [E, D, C, B, A]) => G, k: (...a: [G, E, D, C, B, A]) => H, l: (...a: [H, G, E, D, C, B, A]) => I, m: (...a: [I, H, G, E, D, C, B, A]) => J, n: (...a: [J, I, H, G, E, D, C, B, A]) => K): K
/** Pipes a value through multiple functions, passing the result of each function to the next. */
export function pipe<A, B, C, D, E, G, H, I, J, K, L>(a: A, f: (...a: [A]) => B, g: (...a: [B, A]) => C, h: (...a: [C, B, A]) => D, i: (...a: [D, C, B, A]) => E, j: (...a: [E, D, C, B, A]) => G, k: (...a: [G, E, D, C, B, A]) => H, l: (...a: [H, G, E, D, C, B, A]) => I, m: (...a: [I, H, G, E, D, C, B, A]) => J, n: (...a: [J, I, H, G, E, D, C, B, A]) => K, o: (...a: [K, J, I, H, G, E, D, C, B, A]) => L): L
/** Pipes a value through multiple functions, passing the result of each function to the next. */
export function pipe<A, B, C, D, E, G, H, I, J, K, L, M>(a: A, f: (...a: [A]) => B, g: (...a: [B, A]) => C, h: (...a: [C, B, A]) => D, i: (...a: [D, C, B, A]) => E, j: (...a: [E, D, C, B, A]) => G, k: (...a: [G, E, D, C, B, A]) => H, l: (...a: [H, G, E, D, C, B, A]) => I, m: (...a: [I, H, G, E, D, C, B, A]) => J, n: (...a: [J, I, H, G, E, D, C, B, A]) => K, o: (...a: [K, J, I, H, G, E, D, C, B, A]) => L, p: (...a: [L, K, J, I, H, G, E, D, C, B, A]) => M): M
/** Pipes a value through multiple functions, passing the result of each function to the next. */
export function pipe(a: any, ...fs: ((...a: any[]) => any)[]): any {
    return _pipe(a, ...fs);
}

/** Curries a function with two arguments. */
export const curry = <A, B, C>(f: (a: A, b: B) => C) => (a: A) => (b: B): C => f(a, b);
/** Curries a function with three arguments. */
export const curry3 = <A, B, C, D>(f: (a: A, b: B, c: C) => D) => (a: A) => (b: B) => (c: C): D => f(a, b, c);
/** Curries a function with four arguments. */
export const curry4 = <A, B, C, D, E>(f: (a: A, b: B, c: C, d: D) => E) => (a: A) => (b: B) => (c: C) => (d: D): E => f(a, b, c, d);
/** Curries a function with five arguments. */
export const curry5 = <A, B, C, D, E, F>(f: (a: A, b: B, c: C, d: D, e: E) => F) => (a: A) => (b: B) => (c: C) => (d: D) => (e: E): F => f(a, b, c, d, e);

/** Uncurries a function with two arguments. */
export const uncurry = <A, B, C>(f: (a: A) => (b: B) => C) => (a: A, b: B): C => f(a)(b);
/** Uncurries a function with three arguments. */
export const uncurry3 = <A, B, C, D>(f: (a: A) => (b: B) => (c: C) => D) => (a: A, b: B, c: C): D => f(a)(b)(c);
/** Uncurries a function with four arguments. */
export const uncurry4 = <A, B, C, D, E>(f: (a: A) => (b: B) => (c: C) => (d: D) => E) => (a: A, b: B, c: C, d: D): E => f(a)(b)(c)(d);
/** Uncurries a function with five arguments. */
export const uncurry5 = <A, B, C, D, E, F>(f: (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => F) => (a: A, b: B, c: C, d: D, e: E): F => f(a)(b)(c)(d)(e);

/** Identity function that returns the input value. */
export const id = <A>(a: A): A => a;
/** Negates the result of a function. */
export const not = <A>(f: (a: A) => unknown) => (a: A): boolean => !f(a);
/** Flips the order of arguments of a curried function. */
export const flip = <A, B, C>(f: (a: A) =>(b: B) => C) => (b: B) => (a: A): C => f(a)(b);
/** Converts a function that takes an array to a variadic function. */
export const spread = <A, B>(f: (a: A[]) => B) => (...a: A[]): B => f(a);
/** Converts a variadic function to a function that takes an array. */
export const unspread = <A, B>(f: (...a: A[]) => B) => (a: A[]): B => f(...a);

/** Creates a deep cache for memoization. */
const deepCache = <A extends any[], B>() => {
    type DeepCache<B> = {
        leaf: undefined | { value: B },
        node: Map<any, DeepCache<B>>
    }
    
    const map: DeepCache<B> = { leaf: undefined, node: new Map() };

    return (keys: A, getValue: () => B) => {
        let item: DeepCache<B> = map;
        let miss = false;

        for (const key of keys) {
            let child = miss ? undefined : item.node.get(key);

            if (child === undefined) {
                miss = true;
                child = { leaf: undefined, node: new Map() };
                item.node.set(key, child);
            }

            item = child;
        }

        if (item.leaf === undefined) 
            item.leaf = { value: getValue() };

        return item.leaf.value;
    }        
}

/** Memoizes a function with zero or more arguments. Arguments must be serializable. */
export const memo = <A extends any[], B>(f: (...a: A) => B) => {
    const cache = deepCache<A, B>();
    return (...a: A): B => cache(a, () => f(...a));
}
