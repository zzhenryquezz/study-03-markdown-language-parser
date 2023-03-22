import { describe, it, expect } from 'vitest'
import Lexer from './Lexer'
import Token, { TokenType } from './Token'


describe('lexer', () => {

    const lexer = new Lexer()

    const testCases = [
        [ '### Title', [
            Token.from(TokenType.Hashtag, '#'),
            Token.from(TokenType.Hashtag, '#'),
            Token.from(TokenType.Hashtag, '#'),
            Token.from(TokenType.WhiteSpace, ' '),
            Token.from(TokenType.Word, 'Title'),
        ]],
        [ '# Hello 123', [
            Token.from(TokenType.Hashtag, '#'),
            Token.from(TokenType.WhiteSpace, ' '),
            Token.from(TokenType.Word, 'Hello'),
            Token.from(TokenType.WhiteSpace, ' '),
            Token.from(TokenType.Word, '123'),
        ]],

        ['<b>Hello</b>', [
            Token.from(TokenType.OpenHTMLTag, '<b>'),
            Token.from(TokenType.Word, 'Hello'),
            Token.from(TokenType.CloseHTMLTag, '</b>'),
        ]],

        ['Hello <b>Will Smith</b>', [
            Token.from(TokenType.Word, 'Hello'),
            Token.from(TokenType.WhiteSpace, ' '),
            Token.from(TokenType.OpenHTMLTag, '<b>'),
            Token.from(TokenType.Word, 'Will'),
            Token.from(TokenType.WhiteSpace, ' '),
            Token.from(TokenType.Word, 'Smith'),
            Token.from(TokenType.CloseHTMLTag, '</b>'),
        ]],
       
        ['Hello <b>Will Smith</b> How are you?', [
            Token.from(TokenType.Word, 'Hello'),
            Token.from(TokenType.WhiteSpace, ' '),
            Token.from(TokenType.OpenHTMLTag, '<b>'),
            Token.from(TokenType.Word, 'Will'),
            Token.from(TokenType.WhiteSpace, ' '),
            Token.from(TokenType.Word, 'Smith'),
            Token.from(TokenType.CloseHTMLTag, '</b>'),
            Token.from(TokenType.WhiteSpace, ' '),
            Token.from(TokenType.Word, 'How'),
            Token.from(TokenType.WhiteSpace, ' '),
            Token.from(TokenType.Word, 'are'),
            Token.from(TokenType.WhiteSpace, ' '),
            Token.from(TokenType.Word, 'you?'),
        ]],
    ]

    it.each(testCases)('should tokenize %s', (code, expected) => {
        expect(lexer.tokenize(code as string)).toEqual(expected as Token[])
    })
})