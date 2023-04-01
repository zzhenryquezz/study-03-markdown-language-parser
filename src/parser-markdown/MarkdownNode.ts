export enum MarkdownNodeType {
  Word = 'Word',
  Heading = 'Heading',
  BreakLine = 'BreakLine',
  Paragraph = 'Paragraph',
  WhiteSpace = 'WhiteSpace',
  OpenBold = 'OpenBold',
  CloseBold = 'CloseBold',
  SetupBlock = 'SetupBlock',
  ComponentBlock = 'ComponentBlock'
}

export default class MarkdownNode<D = undefined | any> {
  public _parentId: number

  public type: MarkdownNodeType
  public data?: D

  constructor(props: MarkdownNode) {
    this._parentId = props._parentId
    this.type = props.type
    this.data = props.data
  }

  public static isBreakLine(node: MarkdownNode) {
    if (!node) return false

    if (node.type === MarkdownNodeType.BreakLine) return true

    if (node.type === MarkdownNodeType.Paragraph) {
      return node.data.children[0]?.type === MarkdownNodeType.BreakLine
    }

    return false
  }

  public static createBreakLine(data: MarkdownNode['data']) {
    return new MarkdownNode({
      _parentId: -1,
      type: MarkdownNodeType.Paragraph,
      data: {
        children: [
          new MarkdownNode({
            _parentId: -1,
            type: MarkdownNodeType.BreakLine,
            data
          })
        ]
      }
    })
  }

  public static createWhiteSpace(data: MarkdownNode['data']) {
    return new MarkdownNode({
      _parentId: -1,
      type: MarkdownNodeType.WhiteSpace,
      data
    })
  }
}
