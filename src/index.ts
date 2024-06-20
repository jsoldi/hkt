import { KArray, array } from "./array.js";
import { Cont, KCont, cont } from "./cont.js";
import { trivial } from "./trivial.js";
import { Either, IEither } from "./either.js";
import { fail, maybe } from "./fail.js";
import { chain, pipe } from "./pipe.js";
import { ILeft, KLeft, left } from "./left.js";
import { KApp } from "./hkt.js";

async function main() {
    const c = cont();

    c.pipe(
        c.unit(10),
        a => c.unit(a + 1),
    )
}

main();
