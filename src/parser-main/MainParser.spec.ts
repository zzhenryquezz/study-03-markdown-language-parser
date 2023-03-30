import { describe, it, expect } from 'vitest'

import MainParser from './MainParser'
import Lexer from '../lexer/Lexer'

describe('parser-main', () => {
  const lexer = new Lexer()
  const parser = new MainParser()

  const files = import.meta.glob('../tests/fixtures/*.md', {
    eager: true,
    as: 'raw'
  })

  it.each(Object.entries(files))('should parse fixtures %s', (filename, content) => {
    const tokens = lexer.tokenize(content)

    parser.setTokens(tokens)

    const result = parser.toNodes()

    const length = result.reduce((r, n) => r + n.tokens.length, 0)

    expect(result).toMatchSnapshot()

    expect(length).toBe(tokens.length)
  })
})
