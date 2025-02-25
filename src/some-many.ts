// - alternative:
// some :: f a -> f [a]
// some v = some_v
//   where
//     many_v = some_v <|> pure []
//     some_v = liftA2 (:) v many_v        
// const some = <A>(v: $<F, A>): $<F, A[]> => {
//     return base.lift2((a: A, as: A[]) => [a, ...as])(
//         v, 
//         base.append(some(v), base.unit([]))
//     );
// }

// - monadPlus:
// const many = <A>(v: $<F, A>): $<F, A[]> => {
//     return base.append(some(v), base.unit([]));
// }

            // some :: f a -> f [a]
            // some v = some_v
            //   where
            //     many_v = some_v <|> pure []
            //     // some_v = liftA2 (:) v many_v        
            //     some_v = v >>= \a -> (some_v <|> pure []) >>= \as -> pure (a:as)
            // const some = <A>(v: $<F, A>): $<F, A[]> => {
            //     const many_v = base.append(some(v), base.unit([]));
            //     return base.lift2((a: A, as: A[]) => [a, ...as])(v, many_v);
            // }
            // (liftA2 (:) v (
            //      (liftA2 (:) v 
            //          (some_v <|> pure [])
            //      ) <|> pure []
            // ))

            // const many = <A>(v: $<F, A>): $<F, A[]> => {
            //     return base.append(some(v), base.unit([]));
            // }
