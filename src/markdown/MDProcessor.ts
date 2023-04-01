import type Token from '@/lexer/Token'
import { TokenType } from '@/lexer/Token'
import MDNode from './MDNode'

export default class MDProcessor {
  public name = 'MDProcessor'
  public order = 90
  public tokens: Token[] = []
  public nodes: MDNode[] = []

  constructor() {
    this.name = this.constructor.name
  }

  public removeToken(index: number) {
    this.tokens.splice(index, 1)
  }

  public removeTokens(start: number, end: number) {
    this.tokens.splice(start, end)
  }

  public addNode(payload: Pick<MDNode, 'type' | 'tokens'>) {
    const mdNode = new MDNode()

    mdNode.type = payload.type
    mdNode.tokens = payload.tokens

    this.nodes.push(mdNode)
  }

  public findEndLineTokenIndex() {
    return this.tokens.findIndex(
      (t) => t.type === TokenType.BreakLine || t.type === TokenType.EndOfFile
    )
  }

  /**
   * Process the tokens
   * Tip: Normally the first token is the beginning of line
   * @returns true if the processor has processed the tokens
   */

  public process(): boolean {
    return false
  }
}
