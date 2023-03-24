export enum TokenType {
    Word = 'Word',
    Symbol = 'Symbol',
    Hashtag = 'Hashtag',
    WhiteSpace = 'WhiteSpace',
    BreakLine = 'BreakLine',
}

// TODO: add startIndex and endIndex
export default class Token {
    public type: TokenType | string
    public value: string

    constructor(props: Token) {
        this.type = props.type
        this.value = props.value
    }

    public static from(type: TokenType | string, value: string) {
        return new Token({ type, value })
    }
}