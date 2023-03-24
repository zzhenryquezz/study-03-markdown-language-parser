import { describe, it, expect } from 'vitest'
import Lexer from './Lexer'
describe('lexer', () => {

    const lexer = new Lexer()
    
    const files = import.meta.glob('../tests/fixtures/*.md', {
        eager: true,
        as: 'raw'
    })

    it.each(Object.entries(files))('should tokenize fixtures %s', (filename, content) => {
        expect(lexer.tokenize(content)).toMatchSnapshot()        
    })
})