export enum MarkdownNodeType {
    Word = 'Word',
    BreakLine = 'BreakLine',
    Paragraph = 'Paragraph',
    WhiteSpace = 'WhiteSpace',
}

export default class MarkdownNode {
    public _parentId: number;
    
    public type: string;
    public data?: any;

    constructor(props: MarkdownNode) {
        this._parentId = props._parentId
        this.type = props.type
        this.data = props.data
    }
}