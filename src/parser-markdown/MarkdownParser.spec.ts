import { describe, it, expect } from 'vitest'
import Lexer from '../lexer/Lexer'
import MarkdonwParser from './MarkdownParser'


describe('parser-markdown', () => {

    const lexer = new Lexer()
    const parser = new MarkdonwParser()

    const files = import.meta.glob('../tests/fixtures/*.md', {
        eager: true,
        as: 'raw'
    })

    it.each(Object.entries(files))('should parse fixtures %s', (filename, content) => {
        const tokens = lexer.tokenize(content)

        parser.setTokens(tokens)

        const result = parser.toMarkdownNodes()

        expect(result).toMatchSnapshot()
    })
    
    it.each(Object.entries(files))('should revert fixtures to text %s', (_, payload) => {

        parser.setTokensByText(payload)

        const markdownNodes = parser.toMarkdownNodes()

        expect(parser.convertMarkdownNodesToText(markdownNodes)).toBe(payload)
    })
    
})