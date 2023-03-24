import type LexerProcessor from "../LexerProcessor"
import Token, { TokenType } from "../Token"

export default class OpenCodeBlockProcessor implements LexerProcessor {
    public order = 10

    public process: LexerProcessor['process'] = (char, chars, tokens) => {
        const word = chars.slice(0, 6).join('')

        if (word !== '[code]') return false

        tokens.push(Token.from(TokenType.OpenCodeBlock, word))

        chars.splice(0, 6)

        return true
    }
}