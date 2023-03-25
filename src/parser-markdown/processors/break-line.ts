import MarkdownNode from "../MarkdownNode";
import type MarkdownProcessor from "../MarkdownProcessor";

export default class BreakLineProcessor implements MarkdownProcessor {
    public order = 10

    public process: MarkdownProcessor["process"] = ({ current, mainNode, tokens, markdownNodes }) => {

        if (current.type !== "BreakLine") return false

        const node = new MarkdownNode({
            _parentId: mainNode._id,
            _parent: mainNode,
            type: "BreakLine",
            data: {
                value: "\n"
            }
        })

        markdownNodes.push(node)

        tokens.shift()        

        return true
    }
}