import type LexerProcessor from "../LexerProcessor"
import Token, { TokenType } from "../Token"

export default class CloseHTMLTagProcessor implements LexerProcessor {
    public order = 40

    public process: LexerProcessor['process'] = (char, chars, tokens) => {
        if (char !== '<') return false

        if (chars[1] !== '/') return false

        let endIndex = chars.findIndex(c => c === '>')

        if (endIndex === -1) endIndex = chars.length

        const tag = chars.slice(0, endIndex + 1).join('')

        tokens.push(Token.from(TokenType.CloseHTMLTag, tag))

        if (endIndex > 0) chars.splice(0, endIndex + 1)
        
        if (endIndex === 0) chars.shift()

        return true
    }
}