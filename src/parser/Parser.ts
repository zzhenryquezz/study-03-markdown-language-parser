import type Token from "../lexer/Token";
import { TokenType } from "../lexer/Token";
import MainNode from "./MainNode";

export default class Parser {
    constructor(private tokens: Token[]) {}

    public static from(tokens: Token[]) {
        return new Parser(tokens)
    }

    public parce() {

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

        while(tokens.length && tokens[0].type !== TokenType.EndOfFile) {

            const endIndex = tokens.findIndex((t) => t.type === TokenType.BreakLine || t.type === TokenType.EndOfFile)
        
            const related = tokens.slice(0, endIndex)
            
            const first = related[0]
            const last = related[related.length - 1]        
    
            if (!first || !last) {
                nodes.push(MainNode.from({
                    _id: id,
                    content: tokens[0].value,
                    position: tokens[0].position,
                    tokens: [tokens[0]]
                }))
                tokens.shift()
                id++
                continue
            }
    
            const content = related.map((t) => t.value).join('')
    
            const node = MainNode.from({
                _id: id,
                content,
                tokens: related,
                position: {
                    start: first.position.start,
                    end: last.position.end
                }
            })
    
            tokens.splice(0, endIndex)
    
            nodes.push(node)

            id++        

            tokens.shift()

        }

        return nodes
    }
}