import type LexerProcessor from "../LexerProcessor"
import Token, { TokenType } from "../Token"

export default class CloseCodeBlockProcessor implements LexerProcessor {
    public order = 10

    public process: LexerProcessor['process'] = (char, chars, tokens) => {
        const word = chars.slice(0, 7).join('')

        if (word !== '[/code]') return false

        tokens.push(Token.from(TokenType.CloseCodeBlock, word))

        chars.splice(0, 7)

        return true
    }
}