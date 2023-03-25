import Lexer from "@/lexer/Lexer";
import type Token from "../lexer/Token";
import { TokenType } from "../lexer/Token";
import MainNode, { type TokenWithPosition } from "./MainNode";

export default class MainParser {
    constructor(public tokens: Token[] = []) {}


    public setTokens(tokens: Token[]) {
        this.tokens = tokens
    }

    public setTokensByText(text: string) {
        const lexer = new Lexer()
        
        this.tokens = lexer.tokenize(text)
    }

    public setTokensByNodes(nodes: MainNode[]) {
        this.tokens = nodes.map(n => n.tokens).flat()
    }

    public toNodes() {

        let currentStart = 0

        const tokens = this.tokens.slice().map(t => { 

            const position =  {
                start: currentStart,
                end: currentStart + t.value.length
            }

            currentStart = position.end

            return { ...t, position }
            
        })

        const nodes: MainNode[] = []

        let id = 0
        const children: TokenWithPosition[] = []

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i]

            
            children.push(token)

            const isEnd  = [TokenType.BreakLine, TokenType.EndOfFile].includes(token.type)
            
            if (!isEnd) continue

            const first = children[0]
            const last = children[children.length - 1]    
            const content = children.map(c => c.value).join('')

            const node = MainNode.from({
                _id: id,
                content,
                tokens: children.slice(),
                position: {
                    start: first ? first.position.start : token.position.start,
                    end: last ? last.position.end : token.position.end
                }
            })

            nodes.push(node)

            children.length = 0
            id++
    
        }

        // while(tokens.length && tokens[0].type !== TokenType.EndOfFile) {

        //     const endIndex = tokens.findIndex((t) => t.type === TokenType.BreakLine || t.type === TokenType.EndOfFile)
        
        //     const related = tokens.slice(0, endIndex)
            
        //     const first = related[0]
        //     const last = related[related.length - 1]        
    
        //     if (!first || !last) {
        //         nodes.push(MainNode.from({
        //             _id: id,
        //             content: tokens[0].value,
        //             position: tokens[0].position,
        //             tokens: [tokens[0]]
        //         }))
        //         tokens.shift()
        //         id++
        //         continue
        //     }
    
        //     const content = related.map((t) => t.value).join('')
    
        //     const node = MainNode.from({
        //         _id: id,
        //         content,
        //         tokens: related,
        //         position: {
        //             start: first.position.start,
        //             end: last.position.end
        //         }
        //     })
    
        //     tokens.splice(0, endIndex)
    
        //     nodes.push(node)

        //     id++        

        //     tokens.shift()

        // }

        return nodes
    }
}