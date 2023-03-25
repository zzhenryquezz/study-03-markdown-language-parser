import MarkdownNode from "../MarkdownNode";
import type MarkdownTokenProcessor from "../MarkdownTokenProcessor";

export default class HeadingProcessor implements MarkdownTokenProcessor {
    public order = 10

    public process: MarkdownTokenProcessor["process"] = ({ mainNode, tokens, markdownNodes }) => {
        if (tokens[0].value !== "#") return false

        const level = tokens.filter((t) => t.value === "#").length
        const value = tokens.slice(level).map((t) => t.value).join("").trim()

        const node = new MarkdownNode({
            _parentId: mainNode._id,
           //  _parent: mainNode,
            type: "Heading",
            data: {
                level,
                value
            }
        })

        markdownNodes.push(node)

        tokens.splice(0, tokens.length)

        return true
    }
}