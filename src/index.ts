import { array } from "./array.js";
import { Cont, TCont, cont } from "./cont.js";
import { trivial } from "./trivial.js";
import { Either } from "./either.js";
import { fail, maybe } from "./fail.js";
import { chain, pipe } from "./pipe.js";
import { left } from "./left.js";

export function test<T>(fa: Either<T, Error>) {
    return fail.pipe(
        fa,
        chain(JSON.stringify, fail.unit)
    )
}

async function main() {
    const mc = maybe.transform<TCont>(cont);

    const rats = mc.unit(10);
    
    //const lel = maybe.wrap(cont.delay)(123);

    mc.pipe(
        mc.unit(10),
        a => cont.map(cont.delay(123), maybe.unit)
    )
}

main();
