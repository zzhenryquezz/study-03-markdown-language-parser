export default class MarkdownSyntaxError extends Error {
  public name = 'MarkdownSyntaxError'

  public constructor(message: string) {
    super(message)
  }
}
