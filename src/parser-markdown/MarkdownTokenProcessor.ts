import type Token from "@/lexer/Token"
import type MainNode from "@/parser-main/MainNode"
import type MarkdownNode from "./MarkdownNode"

interface Options {
    mainNode: MainNode
    current: Token
    tokens: Token[]
    markdownNodes: MarkdownNode[]
}

interface ReverserResult {
    _parentId: number
    content: string
}

export default interface MarkdownTokenProcessor {
    order: number
    process: (options: Options) => boolean
    reverse: (node: MarkdownNode) => Token[]
}
