import type MarkdownNode from "./MarkdownNode"

export default interface MarkdownNodeProcessor {
    order: number
    process: (nodes: MarkdownNode[]) => MarkdownNode[]
    reverse: (nodes: MarkdownNode[]) => MarkdownNode[]
}
