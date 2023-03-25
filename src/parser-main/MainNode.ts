import type Token from "@/lexer/Token";

export interface Position {
    start: number;
    end: number;
}

export interface TokenWithPosition extends Token {
    position: Position
}

export default class MainNode {
    public _id: number;
    public position: Position;
    public content: string;
    public tokens: TokenWithPosition[] = []
    
    constructor(props: MainNode) {
        this._id = props._id
        this.position = props.position
        this.content = props.content
        this.tokens = props.tokens
    }

    public static from(props: MainNode) {
        return new MainNode(props)
    }
}