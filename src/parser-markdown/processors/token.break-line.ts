import { TokenType } from "@/lexer/Token";
import MarkdownNode, { MarkdownNodeType } from "../MarkdownNode";
import type MarkdownTokenProcessor from "../MarkdownTokenProcessor";

export default class BreakLineProcessor implements MarkdownTokenProcessor {
    public order = 10

    public process: MarkdownTokenProcessor["process"] = ({ current, mainNode, tokens, markdownNodes }) => {

        if (current.type !== TokenType.BreakLine) return false

        const node = new MarkdownNode({
            _parentId: mainNode._id,
            type: MarkdownNodeType.BreakLine,
            data: {
                value: "\n"
            }
        })

        markdownNodes.push(node)

        tokens.shift()        

        return true
    }
}