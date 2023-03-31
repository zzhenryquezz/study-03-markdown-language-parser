import Token, { TokenType } from '@/lexer/Token'
import MarkdownNode, { MarkdownNodeType } from '../MarkdownNode'
import type MarkdownTokenProcessor from '../MarkdownTokenProcessor'

export default class OpenBoldProcessor implements MarkdownTokenProcessor {
  public order = 20

  public process: MarkdownTokenProcessor['process'] = ({
    current,
    mainNode,
    tokens,
    markdownNodes
  }) => {
    if (current.value !== '*') return false

    const length = tokens.filter((t) => t.value === '*').length

    if (length < 2) return false

    const node = new MarkdownNode({
      _parentId: mainNode._id,
      type: MarkdownNodeType.OpenBold,
      data: {
        value: '**'
      }
    })

    markdownNodes.push(node)

    tokens.splice(0, 2)

    return true
  }

  public reverse: MarkdownTokenProcessor['reverse'] = (node) => {
    if (node.type !== MarkdownNodeType.OpenBold) return []

    return [Token.from(TokenType.Symbol, '*'), Token.from(TokenType.Symbol, '*')]
  }
}
