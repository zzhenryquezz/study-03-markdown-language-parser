import { TokenType } from '@/lexer/Token'
import { MDNodeType } from '../MDNode'
import MDProcessor from '../MDProcessor'

export default class Component extends MDProcessor {
  public order = 10

  public findComponentTokenEndIndex() {
    return this.tokens.findIndex((t, i) => {
      const prev = this.tokens[i - 1]
      const prevPrev = this.tokens[i - 2]

      const isAllBreakLine = [
        prev && prev.type === TokenType.BreakLine,
        prevPrev && prevPrev.type === TokenType.BreakLine,
        t.type === TokenType.BreakLine
      ]

      if (isAllBreakLine.every((v) => v)) return true

      if (t.type === TokenType.EndOfFile) return true

      return false
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
