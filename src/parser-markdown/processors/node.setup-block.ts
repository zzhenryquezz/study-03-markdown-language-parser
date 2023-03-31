import MarkdownNode, { MarkdownNodeType } from '../MarkdownNode'
import type MarkdownNodeProcessor from '../MarkdownNodeProcessor'
import groupBy from 'lodash/groupBy'

// this guy runs last
export default class SetupBlockProcessor implements MarkdownNodeProcessor {
  public order = 80

  public process: MarkdownNodeProcessor['process'] = (nodes) => {
    const [first, second, third, fourth] = nodes

    const isValid = [
      first && first.data.value === ':',
      second && second.data.value === ':',
      third && third.data.value === ' ',
      fourth && fourth.data.value === 'setup'
    ]

    if (!isValid.every(Boolean)) return nodes

    const lines = groupBy(nodes, '_parentId')

    let lineEnd = -1

    for (const key in lines) {
      const lineNodes = lines[key]
      const fisrtNode = lineNodes[0]

      if (key === first._parentId.toString()) continue

      if (MarkdownNode.isBreakLine(fisrtNode)) continue

      if (fisrtNode.type === MarkdownNodeType.WhiteSpace) continue

      lineEnd = Number(key)

      break
    }

    if (lineEnd === -1) {
      lineEnd = nodes[nodes.length - 1]._parentId
    }

    const endIndex = nodes.findIndex((n) => n._parentId === lineEnd)

    if (endIndex === -1) return nodes

    const children = nodes.slice(0, endIndex)

    const node = new MarkdownNode({
      _parentId: nodes[0]._parentId,
      type: MarkdownNodeType.SetupBlock,
      data: {
        children
      }
    })

    return [node, ...nodes.slice(endIndex)]
  }

  public reverse: MarkdownNodeProcessor['reverse'] = (nodes) => {
    const result: MarkdownNode[] = []

    for (const node of nodes) {
      if (node.type !== MarkdownNodeType.SetupBlock) {
        result.push(node)
        continue
      }

      result.push(...node.data.children)
    }

    return result
  }
}
