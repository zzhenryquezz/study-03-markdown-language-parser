import type MainNode from "@/parser-main/MainNode";

export enum MarkdownNodeType {
    Word = 'Word',
    BreakLine = 'BreakLine',
    Paragraph = 'Paragraph',
}

export default class MarkdownNode {
    // public _id: number;
    public _parentId: number;
    // public _parent: MainNode;
    
    public type: string;
    public data?: any;

    constructor(props: MarkdownNode) {
        // this._id = props._id
        this._parentId = props._parentId
        // this._parent = props._parent
        this.type = props.type
        this.data = props.data
    }
}