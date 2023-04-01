import { TokenType } from '@/lexer/Token'
import { MDNodeType } from '../MDNode'
import MDProcessor from '../MDProcessor'

export default class Paragraph extends MDProcessor {
  public order = 90

  public process: MDProcessor['process'] = () => {
    const endIndex = this.tokens.findIndex(
      (t) => t.type === TokenType.BreakLine || t.type === TokenType.EndOfFile
    )

    if (endIndex === -1) return false

    const allTokens = this.tokens.slice(0, endIndex + 1)

    this.addNode({ type: MDNodeType.Paragraph, tokens: allTokens })

    this.removeTokens(0, endIndex + 1)

    return true
  }
}
