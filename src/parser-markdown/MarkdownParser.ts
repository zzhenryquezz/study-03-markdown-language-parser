import type MainNode from "@/parser-main/MainNode";
import MainParser from "@/parser-main/MainParser";
import type MarkdownNode from "./MarkdownNode";
import type MarkdownProcessor from "./MarkdownProcessor";


const files = import.meta.glob('./processors/*.ts', {
    eager: true,
})

const processors: MarkdownProcessor[] = Object.values(files)
    .filter((file: any) => file.default)
    .map((file: any) => new file.default())

export default class MarkdonwParser extends MainParser {

    public processors: MarkdownProcessor[] = processors

    public processMainNode(token: MainNode) {
        const tokens = token.tokens.slice()
        const markdownNodes: MarkdownNode[] = []

        this.processors.sort((a, b) => a.order - b.order)

        while (tokens.length) {
            const current = tokens[0]

            const result = this.processors.find((p) => p.process({ mainNode: token, current, tokens, markdownNodes }))

            if (result) continue

            console.log('[markdown-parser] unhandled token', current)

            tokens.shift()
        }

        return markdownNodes
    }

    public toMarkdownNodes(){

        const nodes = this.toNodes()
        
        const markdownNodes = nodes.reduce<MarkdownNode[]>((r, n) => r.concat(this.processMainNode(n)), [])

        return markdownNodes

    }

}