import MarkdownNode, { MarkdownNodeType } from "../MarkdownNode";
import type MarkdownNodeProcessor from "../MarkdownNodeProcessor";

// this guy runs last
export default class ParagraphProcessor implements MarkdownNodeProcessor {
    public order = 90

    public isStartParagraph(node: MarkdownNode) {
        if (node.type === MarkdownNodeType.Word) return true

        return false
    }

    public process: MarkdownNodeProcessor["process"] = (nodes) => {
        if (!this.isStartParagraph(nodes[0])) return nodes

        const node = new MarkdownNode({
            _parentId: nodes[0]._parentId,
            type: MarkdownNodeType.Paragraph,
            data: {
                children: nodes
            }
        })
        
        return [node]
    }

    public reverse: MarkdownNodeProcessor["reverse"] = (nodes) => {
        const result: MarkdownNode[] = []

        for (let i = 0; i < nodes.length; i++) {
            const current = nodes[i]

            if (current.type !== MarkdownNodeType.Paragraph) {
                result.push(current)
                continue
            }

            result.push(...current.data.children)
            
        }

        return result
    }
}