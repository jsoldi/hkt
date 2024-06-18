import { KArray, array } from "./array.js";
import { Cont, TCont, cont } from "./cont.js";
import { trivial } from "./trivial.js";
import { Either, IEither } from "./either.js";
import { fail, maybe } from "./fail.js";
import { chain, pipe } from "./pipe.js";
import { ILeft, KLeft, left } from "./left.js";
import { KApp } from "./hkt.js";

async function main() {
    // const mc = array.transform(maybe);
    
    var lel = array.fmap(        
        (a: number) =>  {
            console.log(`a: ${a}`)
            return JSON.stringify(JSON.stringify(a));
        },
        (p, q) => `${q} -> ${p}`
    );

    console.log(lel);
}

main();
