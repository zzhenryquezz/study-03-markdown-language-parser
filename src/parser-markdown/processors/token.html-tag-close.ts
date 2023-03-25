import type Token from "@/lexer/Token";
import { TokenType } from "@/lexer/Token";
import MarkdownNode from "../MarkdownNode";
import type MarkdownTokenProcessor from "../MarkdownTokenProcessor";

export default class OpenHTMLTagProcessor implements MarkdownTokenProcessor {
    public order = 10

    public isCloseHTMLTag = (tokens: Token[]) => {
        if (tokens[0].value !== "<") return false

        if (tokens[1].value != '/') return false

        if (tokens[2].type !== TokenType.Word) return false

        if (tokens[3].value !== ">") return false

        return true
    }

    public process: MarkdownTokenProcessor["process"] = ({ current, mainNode, tokens, markdownNodes }) => {

        if (!this.isCloseHTMLTag(tokens)) return false

        const hasOpen = markdownNodes.slice().reverse().find((n) => n.type === "OpenHTMLTag")

        if (!hasOpen) return false

        const raw = tokens.slice(0, 4).map((t) => t.value).join("")
        const value = tokens[2].value

        const node = new MarkdownNode({
            _parentId: mainNode._id,
           //  _parent: mainNode,
            type: "CloseHTMLTag",
            data: { raw, value }
        })

        markdownNodes.push(node)

        tokens.splice(0, 4)

        return true
    }
}