import { TokenType } from "@/lexer/Token";
import MarkdownNode from "../MarkdownNode";
import type MarkdownProcessor from "../MarkdownProcessor";

export default class WordProcessor implements MarkdownProcessor {
    public order = 90

    public process: MarkdownProcessor["process"] = ({ current, mainNode, tokens, markdownNodes }) => {

        if (![TokenType.Word, TokenType.Symbol].includes( current.type)) return false

        const node = new MarkdownNode({
            _parentId: mainNode._id,
            _parent: mainNode,
            type: "Word",
            data: {
                value: current.value
            }
        })

        markdownNodes.push(node)

        tokens.shift()
        

        return true
    }
}