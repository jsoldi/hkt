function _pipe(a: any, ...fs: ((...a: any[]) => any)[]): any {
    return fs.reduce((acc, f) => [f(...acc), ...acc], [a])[0];
}

export function pipe<A>(a: A): A
export function pipe<A, B>(a: A, f: (...a: [A]) => B): B
export function pipe<A, B, C>(a: A, f: (...a: [A]) => B, g: (...a: [B, A]) => C): C
export function pipe<A, B, C, D>(a: A, f: (...a: [A]) => B, g: (...a: [B, A]) => C, h: (...a: [C, B, A]) => D): D
export function pipe<A, B, C, D, E>(a: A, f: (...a: [A]) => B, g: (...a: [B, A]) => C, h: (...a: [C, B, A]) => D, i: (...a: [D, C, B, A]) => E): E
export function pipe<A, B, C, D, E, G>(a: A, f: (...a: [A]) => B, g: (...a: [B, A]) => C, h: (...a: [C, B, A]) => D, i: (...a: [D, C, B, A]) => E, j: (...a: [E, D, C, B, A]) => G): G
export function pipe<A, B, C, D, E, G, H>(a: A, f: (...a: [A]) => B, g: (...a: [B, A]) => C, h: (...a: [C, B, A]) => D, i: (...a: [D, C, B, A]) => E, j: (...a: [E, D, C, B, A]) => G, k: (...a: [G, E, D, C, B, A]) => H): H
export function pipe<A, B, C, D, E, G, H, I>(a: A, f: (...a: [A]) => B, g: (...a: [B, A]) => C, h: (...a: [C, B, A]) => D, i: (...a: [D, C, B, A]) => E, j: (...a: [E, D, C, B, A]) => G, k: (...a: [G, E, D, C, B, A]) => H, l: (...a: [H, G, E, D, C, B, A]) => I): I
export function pipe<A, B, C, D, E, G, H, I, J>(a: A, f: (...a: [A]) => B, g: (...a: [B, A]) => C, h: (...a: [C, B, A]) => D, i: (...a: [D, C, B, A]) => E, j: (...a: [E, D, C, B, A]) => G, k: (...a: [G, E, D, C, B, A]) => H, l: (...a: [H, G, E, D, C, B, A]) => I, m: (...a: [I, H, G, E, D, C, B, A]) => J): J
export function pipe<A, B, C, D, E, G, H, I, J, K>(a: A, f: (...a: [A]) => B, g: (...a: [B, A]) => C, h: (...a: [C, B, A]) => D, i: (...a: [D, C, B, A]) => E, j: (...a: [E, D, C, B, A]) => G, k: (...a: [G, E, D, C, B, A]) => H, l: (...a: [H, G, E, D, C, B, A]) => I, m: (...a: [I, H, G, E, D, C, B, A]) => J, n: (...a: [J, I, H, G, E, D, C, B, A]) => K): K
export function pipe<A, B, C, D, E, G, H, I, J, K, L>(a: A, f: (...a: [A]) => B, g: (...a: [B, A]) => C, h: (...a: [C, B, A]) => D, i: (...a: [D, C, B, A]) => E, j: (...a: [E, D, C, B, A]) => G, k: (...a: [G, E, D, C, B, A]) => H, l: (...a: [H, G, E, D, C, B, A]) => I, m: (...a: [I, H, G, E, D, C, B, A]) => J, n: (...a: [J, I, H, G, E, D, C, B, A]) => K, o: (...a: [K, J, I, H, G, E, D, C, B, A]) => L): L
export function pipe<A, B, C, D, E, G, H, I, J, K, L, M>(a: A, f: (...a: [A]) => B, g: (...a: [B, A]) => C, h: (...a: [C, B, A]) => D, i: (...a: [D, C, B, A]) => E, j: (...a: [E, D, C, B, A]) => G, k: (...a: [G, E, D, C, B, A]) => H, l: (...a: [H, G, E, D, C, B, A]) => I, m: (...a: [I, H, G, E, D, C, B, A]) => J, n: (...a: [J, I, H, G, E, D, C, B, A]) => K, o: (...a: [K, J, I, H, G, E, D, C, B, A]) => L, p: (...a: [L, K, J, I, H, G, E, D, C, B, A]) => M): M
export function pipe(a: any, ...fs: ((...a: any[]) => any)[]): any {
    return _pipe(a, ...fs);
}

function _chain(...fs: ((...a: any[]) => any)[]): (a: any) => any {
    return (a: any) => _pipe(a, ...fs);
}

export function chain<A, B>(f: (...a: [A]) => B): (a: A) => B
export function chain<A, B, C>(f: (...a: [A]) => B, g: (...b: [B, A]) => C): (a: A) => C
export function chain<A, B, C, D>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D): (a: A) => D
export function chain<A, B, C, D, E>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E): (a: A) => E
export function chain<A, B, C, D, E, G>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E, j: (...e: [E, D, C, B, A]) => G): (a: A) => G
export function chain<A, B, C, D, E, G, H>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E, j: (...e: [E, D, C, B, A]) => G, k: (...f: [G, E, D, C, B, A]) => H): (a: A) => H
export function chain<A, B, C, D, E, G, H, I>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E, j: (...e: [E, D, C, B, A]) => G, k: (...f: [G, E, D, C, B, A]) => H, l: (...g: [H, G, E, D, C, B, A]) => I): (a: A) => I
export function chain<A, B, C, D, E, G, H, I, J>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E, j: (...e: [E, D, C, B, A]) => G, k: (...f: [G, E, D, C, B, A]) => H, l: (...g: [H, G, E, D, C, B, A]) => I, m: (...h: [I, H, G, E, D, C, B, A]) => J): (a: A) => J
export function chain<A, B, C, D, E, G, H, I, J, K>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E, j: (...e: [E, D, C, B, A]) => G, k: (...f: [G, E, D, C, B, A]) => H, l: (...g: [H, G, E, D, C, B, A]) => I, m: (...h: [I, H, G, E, D, C, B, A]) => J, n: (...i: [J, I, H, G, E, D, C, B, A]) => K): (a: A) => K
export function chain<A, B, C, D, E, G, H, I, J, K, L>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E, j: (...e: [E, D, C, B, A]) => G, k: (...f: [G, E, D, C, B, A]) => H, l: (...g: [H, G, E, D, C, B, A]) => I, m: (...h: [I, H, G, E, D, C, B, A]) => J, n: (...i: [J, I, H, G, E, D, C, B, A]) => K, o: (...j: [K, J, I, H, G, E, D, C, B, A]) => L): (a: A) => L
export function chain<A, B, C, D, E, G, H, I, J, K, L, M>(f: (...a: [A]) => B, g: (...b: [B, A]) => C, h: (...c: [C, B, A]) => D, i: (...d: [D, C, B, A]) => E, j: (...e: [E, D, C, B, A]) => G, k: (...f: [G, E, D, C, B, A]) => H, l: (...g: [H, G, E, D, C, B, A]) => I, m: (...h: [I, H, G, E, D, C, B, A]) => J, n: (...i: [J, I, H, G, E, D, C, B, A]) => K, o: (...j: [K, J, I, H, G, E, D, C, B, A]) => L, p: (...k: [L, K, J, I, H, G, E, D, C, B, A]) => M): (a: A) => M
export function chain(...fs: ((...a: any[]) => any)[]): (a: any) => any {
    return _chain(...fs);
}

export function curry<A, B, C>(f: (a: A, b: B) => C): (a: A) => (b: B) => C {
    return a => b => f(a, b);
}

export function uncurry<A, B, C>(f: (a: A) => (b: B) => C): (a: A, b: B) => C {
    return (a, b) => f(a)(b);
}

export function flip<A, B, C>(f: (a: A, b: B) => C): (b: B, a: A) => C {
    return (b, a) => f(a, b);
}

export function id<A>(a: A): A {
    return a;
}

export function not<A>(f: (a: A) => boolean): (a: A) => boolean {
    return a => !f(a);
}
