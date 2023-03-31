import Token from '@/lexer/Token'
import MarkdownNode, { MarkdownNodeType } from '../MarkdownNode'
import type MarkdownTokenProcessor from '../MarkdownTokenProcessor'

export default class HeadingProcessor implements MarkdownTokenProcessor {
  public order = 10

  public process: MarkdownTokenProcessor['process'] = ({ mainNode, tokens, markdownNodes }) => {
    if (tokens[0].value !== '#') return false

    const level = tokens.filter((t) => t.value === '#').length
    const raw = tokens
      .slice(level)
      .map((t) => t.value)
      .join('')
    const value = raw.trim()

    const node = new MarkdownNode({
      _parentId: mainNode._id,
      type: MarkdownNodeType.Heading,
      data: {
        breakLineOnEnd: raw.endsWith('\n'),
        level,
        value
      }
    })

    markdownNodes.push(node)

    tokens.splice(0, tokens.length)

    return true
  }

  public reverse: MarkdownTokenProcessor['reverse'] = (node) => {
    if (node.type !== 'Heading') return []

    const result: Token[] = []

    const level = node.data.level ?? 1
    const value = (node.data.value ?? '').split(' ')

    for (let i = 0; i < level; i++) {
      result.push(Token.fromSymbol('#'))
    }

    result.push(Token.fromWhiteSpace())

    for (let i = 0; i < value.length; i++) {
      result.push(Token.fromWord(value[i]))

      if (i < value.length - 1) {
        result.push(Token.fromWhiteSpace())
      }
    }

    if (node.data.breakLineOnEnd) {
      result.push(Token.fromBreakLine())
    }

    return result
  }
}
