import { TokenType } from '@/lexer/Token'
import { MDNodeType } from '../MDNode'
import MDProcessor from '../MDProcessor'

export default class Component extends MDProcessor {
  public order = 10

  public findComponentTokenEndIndex() {
    return this.tokens.findIndex((current, i) => {
      const prev = this.tokens[i - 1]
      const prevPrev = this.tokens[i - 2]

      if (current.type === TokenType.EndOfFile) return true

      if (!prev || !prevPrev) return false

      // must have 3 break lines to end the component
      return [prev, current, prevPrev].every((v) => v.type === TokenType.BreakLine)
    })
  }

  public process: MDProcessor['process'] = () => {
    const [fisrt, second] = this.tokens

    if (fisrt.value !== ':' || second.value !== ':') return false

    const endIndex = this.findComponentTokenEndIndex()

    if (endIndex === -1) return false

    const tokens = this.tokens.slice(0, endIndex + 1)

    this.addNode({
      type: MDNodeType.Component,
      tokens
    })

    this.removeTokens(0, endIndex + 1)

    return true
  }
}
