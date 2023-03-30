import Token, { TokenType } from '@/lexer/Token'
import MarkdownNode, { MarkdownNodeType } from '../MarkdownNode'
import type MarkdownTokenProcessor from '../MarkdownTokenProcessor'

export default class BreakLineProcessor implements MarkdownTokenProcessor {
  public order = 10

  public process: MarkdownTokenProcessor['process'] = ({
    current,
    mainNode,
    tokens,
    markdownNodes
  }) => {
    if (current.type !== TokenType.BreakLine) return false

    const node = new MarkdownNode({
      _parentId: mainNode._id,
      type: MarkdownNodeType.Paragraph,
      data: {
        children: [
          new MarkdownNode({
            _parentId: mainNode._id,
            type: MarkdownNodeType.BreakLine,
            data: {
              value: '\n'
            }
          })
        ]
      }
    })

    markdownNodes.push(node)

    tokens.shift()

    return true
  }

  public reverse: MarkdownTokenProcessor['reverse'] = (node) => {
    if (node.type !== MarkdownNodeType.BreakLine) return []

    return [Token.from(TokenType.BreakLine, '\n')]
  }
}
