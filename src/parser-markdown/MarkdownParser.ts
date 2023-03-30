import Token, { TokenType } from '@/lexer/Token'
import type MainNode from '@/parser-main/MainNode'
import MainParser from '@/parser-main/MainParser'
import type MarkdownNode from './MarkdownNode'
import type MarkdownNodeProcessor from './MarkdownNodeProcessor'
import type MarkdownTokenProcessor from './MarkdownTokenProcessor'

const tokenFiles = import.meta.glob('./processors/token.*.ts', {
  eager: true
})

const nodeFiles = import.meta.glob('./processors/node.*.ts', {
  eager: true
})

const tokenProcessors: MarkdownTokenProcessor[] = Object.values(tokenFiles)
  .filter((file: any) => file.default)
  .map((file: any) => new file.default())

const nodeProcessors: MarkdownNodeProcessor[] = Object.values(nodeFiles)
  .filter((file: any) => file.default)
  .map((file: any) => new file.default())

export default class MarkdonwParser extends MainParser {
  public tokenProcessors: MarkdownTokenProcessor[] = tokenProcessors
  public nodeProcessors: MarkdownNodeProcessor[] = nodeProcessors

  constructor(public tokens: Token[] = []) {
    super(tokens)

    this.tokenProcessors.sort((a, b) => a.order - b.order)
    this.nodeProcessors.sort((a, b) => a.order - b.order)
  }

  public processMainNode(token: MainNode) {
    const tokens = token.tokens.slice()
    const markdownNodes: MarkdownNode[] = []

    while (tokens.length) {
      const current = tokens[0]

      const result = this.tokenProcessors.find((p) =>
        p.process({ mainNode: token, current, tokens, markdownNodes })
      )

      // console.log('[markdown-parser] token', current, result)

      if (result) continue

      if (current.type === TokenType.EndOfFile) {
        tokens.shift()
        continue
      }

      console.log('[markdown-parser] unhandled token', current)

      tokens.shift()
    }

    return this.nodeProcessors.reduce((r, p) => p.process(r), markdownNodes)
  }

  public toMarkdownNodes() {
    const nodes = this.toNodes()

    const markdownNodes = nodes.reduce<MarkdownNode[]>(
      (r, n) => r.concat(this.processMainNode(n)),
      []
    )

    return markdownNodes
  }

  public convertMarkdownNodesToMainNodes(nodes: MarkdownNode[]) {
    this.nodeProcessors.sort((a, b) => a.order - b.order)

    const revertedByNodeProcessor = this.nodeProcessors.reduce((r, p) => p.reverse(r), nodes)

    const tokens: Token[] = []

    for (let i = 0; i < revertedByNodeProcessor.length; i++) {
      const current = revertedByNodeProcessor[i]

      const processor = this.tokenProcessors
        .filter((p) => p.reverse)
        .find((p) => p.reverse(current).length)

      if (!processor) {
        console.log('[markdown-parser] unhandled node', current.type)
        continue
      }

      const result = processor.reverse(current)

      tokens.push(...result)
    }

    tokens.push(Token.from(TokenType.EndOfFile, ''))

    return new MainParser(tokens).toNodes()
  }

  public convertMarkdownNodesToText(nodes: MarkdownNode[]) {
    const mainNodes = this.convertMarkdownNodesToMainNodes(nodes)

    return mainNodes.map((n) => n.content).join('')
  }
}
