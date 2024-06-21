import { array } from "./array.js";
import { cont } from "./cont.js";
import { KApp, KRoot } from "./hkt.js";
import { IMonad } from "./monad.js";

function plap<F>(monad: IMonad<F>) {
    return monad.pipe(
        monad.unit(123),
        a => monad.unit(a.toString())
    )
}

async function main() {
    var lel = cont();
    var mt = array.transform(lel);
    const dada = mt.bind(mt.unit(123), a => mt.unit(a.toString()));
}

main();
