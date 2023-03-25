import type Token from "@/lexer/Token";
import { TokenType } from "@/lexer/Token";
import MarkdownNode from "../MarkdownNode";
import type MarkdownTokenProcessor from "../MarkdownTokenProcessor";

export default class OpenHTMLTagProcessor implements MarkdownTokenProcessor {
    public order = 20

    public isOpenHTMLTag = (tokens: Token[]) => {
        if (tokens[0].value !== "<") return false

        if (tokens[1].type !== TokenType.Word) return false

        if (tokens[2].value !== ">") return false

        return true
    }

    public process: MarkdownTokenProcessor["process"] = ({ mainNode, tokens, markdownNodes }) => {

        if (!this.isOpenHTMLTag(tokens)) return false

        const raw = tokens.slice(0, 3).map((t) => t.value).join("")
        const value = tokens[1].value

        const node = new MarkdownNode({
            _parentId: mainNode._id,
           //  _parent: mainNode,
            type: "OpenHTMLTag",
            data: {
                raw,
                value
            }
        })

        markdownNodes.push(node)

        tokens.splice(0, 3)

        return true
    }
}