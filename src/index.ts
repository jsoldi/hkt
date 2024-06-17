import { array } from "./array.js";
import { Cont, contMonad } from "./cont.js";
import { Gen, genMonad } from "./gen.js";
import { trivial } from "./trivial.js";
import { Either } from "./either.js";
import { fail } from "./fail.js";
import { chain, pipe } from "./pipe.js";

export function test<T>(fa: Either<T, Error>) {
    return fail.pipe(
        fa,
        chain(JSON.stringify, fail.unit)
    )
}

async function main() {
    const lel = test(fail.tryCatch(() => {
        throw new Error("oh shite");

        return { hey: 123 };
    }));

    console.log(lel);
}

main();
