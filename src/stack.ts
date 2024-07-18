import { KRoot } from "./hkt.js";
import { IMonad, monad } from "./monad.js";

export interface StackPop<out T> {
    readonly type: -1
    readonly value: T
}

export interface StackPush<S, out T> {
    readonly type: 1
    readonly left: StackItem<S>
    readonly getRight: (s: S) => StackItem<T>
}

export type StackItem<T> = StackPop<T> | StackPush<any, T>

export interface KStack extends KRoot {
    readonly 0: unknown
    readonly body: StackItem<this[0]>
}

export interface IStack extends IMonad<KStack> {
    lazy<A>(f: () => StackItem<A>): StackItem<A>
    run<A>(head: StackItem<A>): A
}

export const stack: IStack = (() => {
    const unit = <A>(value: A): StackItem<A> => ({ type: -1, value });

    const bind = <A, B>(left: StackItem<A>, getRight: (a: A) => StackItem<B>): StackItem<B> => ({
        type: 1,
        left,
        getRight
    });

    const lazy = <A>(f: () => StackItem<A>) => bind(unit(undefined), f);

    const run = function<T>(_head: StackItem<T>): T {
        let head: StackItem<unknown> = _head;
        const list: StackPush<unknown, unknown>[] = [];
        let max = 0;
    
        while (true) {
            if (head.type === 1) {
                list.push(head);
                max = Math.max(max, list.length);
                head = head.left;
            } 
            else if (head.type === -1) {
                const top = list.pop();
    
                if (top !== undefined) {
                    head = top.getRight(head.value);
                }
                else {
                    console.log(`max: ${max}`);
                    return head.value as T;
                }
            }
        }
    }

    const m = monad<KStack>({ unit, bind });

    return {
        ...m,
        lazy,
        run
    }
})();
