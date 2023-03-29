import Token, { TokenType } from "@/lexer/Token";
import MarkdownNode from "../MarkdownNode";
import type MarkdownTokenProcessor from "../MarkdownTokenProcessor";

export default class WhiteSpaceProcessor implements MarkdownTokenProcessor {
    public order = 20

    public process: MarkdownTokenProcessor["process"] = ({ current, mainNode, tokens, markdownNodes }) => {

        if (current.type !== TokenType.WhiteSpace) return false

        const node = new MarkdownNode({
            _parentId: mainNode._id,
           //  _parent: mainNode,
            type: "WhiteSpace",
            data: {
                value: " "
            }
        })

        markdownNodes.push(node)

        tokens.shift()        

        return true
    }

    public reverse: MarkdownTokenProcessor["reverse"] = (node) => {
        if (node.type !== "WhiteSpace") return []

        return [
            Token.from(TokenType.WhiteSpace, " ")
        ]

    }
}