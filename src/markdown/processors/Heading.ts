import { TokenType } from '@/lexer/Token'
import { MDNodeType } from '../MDNode'
import MDProcessor from '../MDProcessor'

export default class Heading extends MDProcessor {
  public order = 10

  public process: MDProcessor['process'] = () => {
    if (this.tokens[0].value !== '#') return false

    const level = this.tokens.findIndex((t) => t.value !== '#')

    if (this.tokens[level].type !== TokenType.WhiteSpace) return false

    const endIndex = this.findEndLineTokenIndex()

    if (endIndex === -1) return false

    const allTokens = this.tokens.slice(0, endIndex + 1)

    this.addNode({ type: MDNodeType.Heading, tokens: allTokens })

    this.removeTokens(0, endIndex + 1)

    return true
  }
}
