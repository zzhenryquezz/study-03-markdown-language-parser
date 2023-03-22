export enum TokenType {
    Word = 'Word',
    Hashtag = 'Hashtag',
    WhiteSpace = 'WhiteSpace',
    OpenHTMLTag = 'OpenHTMLTag',
    CloseHTMLTag = 'CloseHTMLTag',
}

export default class Token {
    public type: TokenType
    public value: string

    constructor(props: Token) {
        this.type = props.type
        this.value = props.value
    }

    public static from(type: TokenType, value: string) {
        return new Token({ type, value })
    }
}