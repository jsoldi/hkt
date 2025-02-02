newtype ListMonoid a s = ListMonoid { runListMonoid :: a -> [s] }

instance Monoid (ListMonoid a s) where
  mempty = ListMonoid $ \_ -> []
  mappend (ListMonoid f) (ListMonoid g) = ListMonoid $ \x -> f x ++ g x