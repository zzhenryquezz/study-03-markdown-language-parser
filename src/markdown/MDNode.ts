import type Token from '@/lexer/Token'

export enum MDNodeType {
  Paragraph = 'paragraph',
  Heading = 'heading',
  Component = 'component'
}

export default class MDNode {
  public type: MDNodeType
  public tokens: Token[] = []

  constructor(props: Partial<MDNode> = {}) {
    Object.assign(this, props)
  }

  public toText() {
    return this.tokens.map((t) => t.value).join('')
  }
}
