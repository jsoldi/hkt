import Control.Applicative (Alternative(..))

-- Define a Parser type
newtype Parser a = Parser { runParser :: String -> Maybe (a, String) }

-- Make Parser an instance of Functor, Applicative, and Alternative
instance Functor Parser where
    fmap f (Parser p) = Parser $ \input -> do
        (a, rest) <- p input
        Just (f a, rest)

instance Applicative Parser where
    pure a = Parser $ \input -> Just (a, input)
    (Parser pf) <*> (Parser pa) = Parser $ \input -> do
        (f, rest1) <- pf input
        (a, rest2) <- pa rest1
        Just (f a, rest2)

instance Alternative Parser where
    empty = Parser $ \_ -> Nothing
    (Parser p1) <|> (Parser p2) = Parser $ \input ->
        case p1 input of
            Nothing -> p2 input
            result -> result

-- A simple parser that matches a single character
char :: Char -> Parser Char
char c = Parser $ \input ->
    case input of
        (x:xs) | x == c -> Just (c, xs)
        _ -> Nothing

-- Test case: Parse a string of 10 'a's followed by "EOF"
input :: String
input = replicate 10000000 'a' ++ "EOF"

-- Run the test
main :: IO ()
main = do
    print "Running test..."
    let result = runParser (some (char 'a')) input
    case result of
        Just (as, rest) -> do
            print $ "Number of 'a's: " ++ show (length as)
            print $ "Remaining string: " ++ rest
        Nothing -> print "Parsing failed"