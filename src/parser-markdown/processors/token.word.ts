import Token, { TokenType } from '@/lexer/Token'
import MarkdownNode from '../MarkdownNode'
import type MarkdownTokenProcessor from '../MarkdownTokenProcessor'

export default class WordProcessor implements MarkdownTokenProcessor {
  public order = 90

  public process: MarkdownTokenProcessor['process'] = ({
    current,
    mainNode,
    tokens,
    markdownNodes
  }) => {
    if (![TokenType.Word, TokenType.Symbol].includes(current.type)) return false

    const node = new MarkdownNode({
      _parentId: mainNode._id,
      //  _parent: mainNode,
      type: 'Word',
      data: {
        value: current.value
      }
    })

    markdownNodes.push(node)

    tokens.shift()

    return true
  }

  public reverse: MarkdownTokenProcessor['reverse'] = (node) => {
    if (node.type !== 'Word') return []

    if (/[a-z0-9]/.test(node.data.value)) {
      return [Token.from(TokenType.Word, node.data.value)]
    }

    return [Token.from(TokenType.Symbol, node.data.value)]
  }
}
