import { describe, it, expect } from 'vitest'
import Lexer from '../lexer/Lexer'
import MarkdonwParser from './MarkdownParser'

describe('parser-markdown', () => {
  const lexer = new Lexer()
  const parser = new MarkdonwParser()

  const fixturesFilter = process.env.FIXTURES_FILTER

  const files = import.meta.glob('../tests/fixtures/*.md', {
    eager: true,
    as: 'raw'
  })

  const entries = Object.entries(files).filter(
    ([filename]) => !fixturesFilter || filename.includes(fixturesFilter)
  )

  it.each(entries)('should parse fixtures %s', (filename, content) => {
    const tokens = lexer.tokenize(content)

    parser.setTokens(tokens)

    const result = parser.toMarkdownNodes()

    expect(result).toMatchSnapshot()
  })

  it.each(entries)('should revert fixtures to text %s', (filename, payload) => {
    parser.setTokensByText(payload)

    const markdownNodes = parser.toMarkdownNodes()

    const result = parser.convertMarkdownNodesToText(markdownNodes)

    expect(result).toBe(payload)
  })
})
