import type LexerProcessor from './LexerProcessor'
import Token, { TokenType } from './Token'


const files = import.meta.glob('./processors/*.ts', {
    eager: true,
})

const processors = Object.values(files)
    .filter((file: any) => file.default)
    .map((file: any) => new file.default())

export default class Lexer {
    
    public processors: LexerProcessor[] = processors

    public isAlpha(char: string){
        return /[a-zA-Z0-9?]/.test(char)
    }

    public isWhitespace(char: string){
        return /\s/.test(char)
    }

    public isText(char: string){
        return this.isAlpha(char) || this.isWhitespace(char)
    }

    public tokenize(code: string){
        const tokens: Token[] = []

        const chars = code.split('')

        while(chars.length){
            const current = chars[0]

            // console.log('current', current)

            this.processors.sort((a, b) => a.order - b.order)

            const result = this.processors.find((p) => p.process(current, chars, tokens))

            if (result) continue

            console.log('[lexer] unhandled char', current)

            chars.shift()
        }

        tokens.push(Token.from(TokenType.EndOfFile, ''))

        return tokens
    }
}