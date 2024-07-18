// class CustomPromise<T> {
//     private value: T | null = null;
//     private reason: Error | null = null;
//     private state: 'pending' | 'fulfilled' | 'rejected' = 'pending';
//     private onFulfilledCallbacks: Array<(value: T) => void> = [];
//     private onRejectedCallbacks: Array<(reason: any) => void> = [];

//     constructor(executor: (resolve: (value: T) => void, reject: (reason: Error) => void) => void) {
//         const resolve = (value: T) => {
//             if (this.state === 'pending') {
//                 this.state = 'fulfilled';
//                 this.value = value;
//                 this.onFulfilledCallbacks.forEach(callback => callback(value));
//             }
//         };

//         const reject = (reason: any) => {
//             if (this.state === 'pending') {
//                 this.state = 'rejected';
//                 this.reason = reason;
//                 this.onRejectedCallbacks.forEach(callback => callback(reason));
//             }
//         };

//         try {
//             executor(resolve, reject);
//         } catch (error) {
//             reject(error);
//         }
//     }

//     then<U>(onFulfilled: (value: T) => CustomPromise<U>, onRejected?: (reason: any) => CustomPromise<U>): CustomPromise<U> {
//         return new CustomPromise<U>((resolve, reject) => {
//             const handleFulfilled = (value: T) => {
//                 try {
//                     const result = onFulfilled(value);
//                     resolve(result.value!);
//                 } catch (error) {
//                     reject(error);
//                 }
//             };

//             const handleRejected = (reason: any) => {
//                 if (onRejected) {
//                     try {
//                         const result = onRejected(reason);
//                         resolve(result.value!);
//                     } catch (error) {
//                         reject(error);
//                     }
//                 } else {
//                     reject(reason);
//                 }
//             };

//             if (this.state === 'fulfilled') {
//                 handleFulfilled(this.value!);
//             } else if (this.state === 'rejected') {
//                 handleRejected(this.reason);
//             } else {
//                 this.onFulfilledCallbacks.push(handleFulfilled);
//                 this.onRejectedCallbacks.push(handleRejected);
//             }
//         });
//     }

//     catch<U>(onRejected: (reason: any) => CustomPromise<U>): CustomPromise<U> {
//         return this.then(value => CustomPromise.resolve(value as unknown as U), onRejected);
//     }

//     static resolve<U>(value: U): CustomPromise<U> {
//         return new CustomPromise<U>((resolve) => resolve(value));
//     }

//     static reject<U>(reason: any): CustomPromise<U> {
//         return new CustomPromise<U>((_, reject) => reject(reason));
//     }
// }

// // Example usage
// const promise = CustomPromise.resolve(5)
//     .then(x => CustomPromise.resolve(x * 2))
//     .then(x => CustomPromise.resolve(x + 3));

// promise.then(result => {
//     console.log(result); // Output: 13
// });
