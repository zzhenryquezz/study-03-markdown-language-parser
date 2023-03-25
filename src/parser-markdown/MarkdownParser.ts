import type MainNode from "@/parser-main/MainNode";
import MainParser from "@/parser-main/MainParser";
import type MarkdownNode from "./MarkdownNode";
import type MarkdownNodeProcessor from "./MarkdownNodeProcessor";
import type MarkdownTokenProcessor from "./MarkdownTokenProcessor";


const tokenFiles = import.meta.glob('./processors/token.*.ts', {
    eager: true,
})

const nodeFiles = import.meta.glob('./processors/node.*.ts', {
    eager: true,
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

    public processMainNode(token: MainNode) {
        const tokens = token.tokens.slice()
        const markdownNodes: MarkdownNode[] = []

        this.tokenProcessors.sort((a, b) => a.order - b.order)
        this.nodeProcessors.sort((a, b) => a.order - b.order)

        while (tokens.length) {
            const current = tokens[0]

            const result = this.tokenProcessors.find((p) => p.process({ mainNode: token, current, tokens, markdownNodes }))

            if (result) continue

            console.log('[markdown-parser] unhandled token', current)

            tokens.shift()
        }

        const result = this.nodeProcessors.reduce((r, p) => p.process(r), markdownNodes)

        return result
    }

    public toMarkdownNodes(){

        const nodes = this.toNodes()
        
        const markdownNodes = nodes.reduce<MarkdownNode[]>((r, n) => r.concat(this.processMainNode(n)), [])

        return markdownNodes

    }

}