import { describe, it, expect } from 'vitest'

import Parser from './Parser'
import Lexer from './../lexer/Lexer'


describe('parser', () => {

    const lexer = new Lexer()


    const files = import.meta.glob('../tests/fixtures/*.md', {
        eager: true,
        as: 'raw'
    })

    it.each(Object.entries(files))('should parse fixtures %s', (filename, content) => {
        const tokens = lexer.tokenize(content)

        const result = Parser.from(tokens).parce()

        expect(result).toMatchSnapshot()
    })
    
    
})