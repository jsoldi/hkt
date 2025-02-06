{-# LANGUAGE InstanceSigs #-}

newtype ListReader r a = ListReader { runListReader :: r -> [a] }

instance Functor (ListReader r) where
    fmap :: (a -> b) -> ListReader r a -> ListReader r b
    fmap f (ListReader g) = ListReader (\r -> map f (g r))

-- Example usage
example :: ListReader Int String
example = ListReader (\x -> replicate x "Hello")

main :: IO ()
main = do
    let result = runListReader (fmap (++ " World") example) 3
    print result  -- Output: ["Hello World","Hello World","Hello World"]