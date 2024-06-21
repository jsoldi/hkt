import { array } from "./array.js";
import { cont } from "./cont.js";
import { KApp, KRoot } from "./hkt.js";

async function main() {
    var lel = cont();
    var mt = array.transform(lel);
    const dada = mt.unit(123);
}

main();
