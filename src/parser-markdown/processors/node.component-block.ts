import MarkdownNode, { MarkdownNodeType } from '../MarkdownNode'
import type MarkdownNodeProcessor from '../MarkdownNodeProcessor'
import groupBy from 'lodash/groupBy'
import MarkdownSyntaxError from '../MarkdownSyntaxError'

// this guy runs last
export default class ComponentBlockProcessor implements MarkdownNodeProcessor {
  public order = 80

  public isOpening(nodes: MarkdownNode[]): boolean {
    const [first, second, third, fourth] = nodes

    const isValid = [
      first && first.data.value === ':',
      second && second.data.value === ':',
      third && third.type === MarkdownNodeType.WhiteSpace,
      fourth && fourth.type === MarkdownNodeType.Word
    ]

    return isValid.every(Boolean)
  }

  public mountChildren(nodes: MarkdownNode[]) {
    const lines = groupBy(nodes, '_parentId')
    const [first] = nodes

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

    const endIndex = nodes.findIndex((n) => n._parentId === lineEnd) - 1

    if (endIndex === -1) {
      throw new MarkdownSyntaxError('Component block is not closed')
    }

    return {
      children: nodes.slice(0, endIndex),
      endIndex
    }
  }

  public process: MarkdownNodeProcessor['process'] = (nodes) => {
    if (!this.isOpening(nodes)) return nodes

    const { children, endIndex } = this.mountChildren(nodes)

    const node = new MarkdownNode({
      _parentId: nodes[0]._parentId,
      type: MarkdownNodeType.ComponentBlock,
      data: {
        children
      }
    })

    return [node, ...nodes.slice(endIndex)]
  }

  public reverse: MarkdownNodeProcessor['reverse'] = (nodes) => {
    const result: MarkdownNode[] = []

    for (const node of nodes) {
      if (node.type !== MarkdownNodeType.ComponentBlock) {
        result.push(node)
        continue
      }

      result.push(...node.data.children)
    }

    return result
  }
}
