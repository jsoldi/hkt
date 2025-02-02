- Set shouldn't implement IFold because it has no order.
//- Need a way to test whether a monoid is empty since Haskell can do it by comparing to mempty. (actually Haskell can't)
- If you can write function A from function B and function B from function A, then they are isomorphic.
- Create a comonoid typeclass and see whether it's isomorphic to IFold.
- 