import { monadPlus } from "./classes/monadPlus.js";
import { KRoot, KTypeOf } from "./core/hkt.js";
import { cont } from "./types/cont/cont.js";
import { maybe } from "./types/maybe.js";
import { num } from "./types/primitive.js";
import { state } from "./types/state.js";
import { task } from "./types/task.js";

const trampoline = cont.trampoline;
type Trampoline<A> = KTypeOf<typeof trampoline, A>;

const lel = state.of<string>().transform(maybe.transform(trampoline));
type Parser<T> = KTypeOf<typeof lel, T>;

interface KParser extends KRoot {
    readonly 0: unknown
    readonly body: Parser<this[0]>
}

const parser = (() => {
    const unit = <A>(a: A): Parser<A> => input => trampoline.unit(maybe.unit([a, input]));

    const bind = <A, B>(bp: Parser<A>, fb: (a: A) => Parser<B>): Parser<B> => {
        return lel.bind(bp, a => ((input) => trampoline.suspend(() => fb(a)(input))));
    }

    const empty = <A>(): Parser<A> => _ => trampoline.unit(maybe.nothing);

    const append = <A>(p1: Parser<A>, p2: Parser<A>): Parser<A> => (input: string) => {
        return trampoline.bind(
            p1(input),
            pair => pair.right ? trampoline.unit(pair) : p2(input)
        )
    }

    const regex = (re: RegExp): Parser<string> => (input: string) => {
        const match = input.match(re);

        return trampoline.unit(
            match === null ? maybe.nothing : maybe.unit([match[0], input.slice(match[0].length)])
        );
    }

    return {
        ...monadPlus<KParser>({ unit, bind, empty, append }),
        regex
    }
})();

let digit = 0;
const nextDigit = () => (digit++ % 10).toString();
const digits = Array.from({ length: 10000 }, nextDigit).join('');

const test = parser.some(parser.regex(/^\d/));
const result = trampoline.drop(test(digits + 'rest'))();

console.log(result);

//---------------------------------------------------------------------------------------------------------------------------------------------
