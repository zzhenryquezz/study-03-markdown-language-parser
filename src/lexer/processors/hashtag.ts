import type LexerProcessor from "../LexerProcessor"
import Token, { TokenType } from "../Token"

export default class HashtagProcessor implements LexerProcessor {
    public order = 30

    public process: LexerProcessor['process'] = (char, chars, tokens) => {
        if (char !== '#') return false

        tokens.push(Token.from(TokenType.Hashtag, char))

        chars.shift()

        return true
    }
}