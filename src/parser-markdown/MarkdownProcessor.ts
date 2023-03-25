import type Token from "@/lexer/Token"
import type MainNode from "@/parser-main/MainNode"
import type MarkdownNode from "./MarkdownNode"

interface Options {
    mainNode: MainNode
    current: Token
    tokens: Token[]
    markdownNodes: MarkdownNode[]
}

export default interface MarkdownProcessor {
    order: number
    process: (options: Options) => boolean
}
