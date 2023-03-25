import { TokenType } from "@/lexer/Token";
import MarkdownNode from "../MarkdownNode";
import type MarkdownProcessor from "../MarkdownProcessor";

export default class WhiteSpaceProcessor implements MarkdownProcessor {
    public order = 20

    public process: MarkdownProcessor["process"] = ({ current, mainNode, tokens, markdownNodes }) => {

        if (current.type !== TokenType.WhiteSpace) return false

        const node = new MarkdownNode({
            _parentId: mainNode._id,
            _parent: mainNode,
            type: "WhiteSpace",
            data: {
                value: " "
            }
        })

        markdownNodes.push(node)

        tokens.shift()        

        return true
    }
}