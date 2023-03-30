export enum MarkdownNodeType {
  Word = 'Word',
  Heading = 'Heading',
  BreakLine = 'BreakLine',
  Paragraph = 'Paragraph',
  WhiteSpace = 'WhiteSpace'
}

export default class MarkdownNode<D = undefined | any> {
  public _parentId: number

  public type: string
  public data?: D

  constructor(props: MarkdownNode) {
    this._parentId = props._parentId
    this.type = props.type
    this.data = props.data
  }
}
