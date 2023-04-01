import Lexer from '@/lexer/Lexer'
import type Token from '@/lexer/Token'
import type MDNode from './MDNode'
import type MDProcessor from './MDProcessor'

const files = import.meta.glob('./processors/*.ts', {
  eager: true
})

const processors: MDProcessor[] = Object.values(files)
  .filter((file: any) => file.default)
  .map((file: any) => new file.default())

export default class MDParser {
  private lexer = new Lexer()
  private processors = processors

  public toNodes(value: string) {
    let tokens = this.lexer.tokenize(value)
    let nodes: MDNode[] = []

    this.processors.sort((a, b) => a.order - b.order)

    while (tokens.length) {
      const result = this.processors.find((p) => {
        p.tokens = tokens
        p.nodes = nodes

        const test = p.process()

        tokens = p.tokens
        nodes = p.nodes

        return test
      })

      if (result) continue

      console.log('[md-parser] unhandled token', tokens[0])

      tokens.shift()
    }

    return nodes
  }

  public toText(nodes: MDNode[]) {
    return nodes.map((node) => node.toText()).join('')
  }
}
