import MarkdownNode, { MarkdownNodeType } from "../MarkdownNode";
import type MarkdownNodeProcessor from "../MarkdownNodeProcessor";

// this guy runs last
export default class ParagraphProcessor implements MarkdownNodeProcessor {
    public order = 90

    public process: MarkdownNodeProcessor["process"] = (nodes) => {

        const result: MarkdownNode[] = []
        

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i]

            if (node.type !== MarkdownNodeType.Word) {
                result.push(node)
                continue
            }

            const end = nodes.findIndex((n, i) => {
                if (n.type === MarkdownNodeType.BreakLine) return true

                if (i === nodes.length - 1) return true

                return false
            })

            if (end === -1) {
                result.push(node)
                continue
            }

            const children = nodes.splice(i, end - i)

            result.push(new MarkdownNode({
                _parentId: node._parentId,
                type: MarkdownNodeType.Paragraph,
                data: {
                    children
                }
            }))
        }

        return result
    }
}