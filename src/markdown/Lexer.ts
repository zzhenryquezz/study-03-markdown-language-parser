import Token, { TokenType } from './Token'

export default class Lexer {

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

            if(current === '#'){
                tokens.push(Token.from(TokenType.Hashtag, current))

                chars.shift()
                continue
            }

            // check for close tag

            if (current === '<' && chars[1] === '/'){
                const endIndex = chars.findIndex((c) => c === '>') + 1

                const tag = chars.slice(0, endIndex).join('')

                tokens.push(Token.from(TokenType.CloseHTMLTag, tag))

                chars.splice(0, endIndex)

                continue
            }

            // check for open tag

            if (current === '<'){
                const endIndex = chars.findIndex((c) => c === '>') + 1

                const tag = chars.slice(0, endIndex).join('')

                tokens.push(Token.from(TokenType.OpenHTMLTag, tag))

                chars.splice(0, endIndex)

                continue
            }

            // check for whitespace

            if (this.isWhitespace(current)){
                let endIndex = chars.findIndex(c => !this.isWhitespace(c))
                
                if (endIndex === -1) endIndex = chars.length

                const whitespace = chars.slice(0, endIndex).join('')

                tokens.push(Token.from(TokenType.WhiteSpace, whitespace))

                if (endIndex > 0) chars.splice(0, endIndex)
                
                if (endIndex === 0) chars.shift()

                continue
            }

            // check for word
            
            if (this.isAlpha(current)){
                let endIndex = chars.findIndex(c => !this.isAlpha(c))
                
                if (endIndex === -1) endIndex = chars.length

                const word = chars.slice(0, endIndex).join('')

                tokens.push(Token.from(TokenType.Word, word))

                if (endIndex > 0) chars.splice(0, endIndex)
                
                if (endIndex === 0) chars.shift()

                continue
            }

            console.log('unhandled char', current)

            chars.shift()
        }

        return tokens
    }
}