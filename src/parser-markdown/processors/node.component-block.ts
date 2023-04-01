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

      const isLast = Number(key) === nodes[nodes.length - 1]._parentId

      if (key === first._parentId.toString()) continue

      if (MarkdownNode.isBreakLine(fisrtNode) && isLast) {
        lineEnd = Number(key)
        break
      }

      if (MarkdownNode.isBreakLine(fisrtNode)) continue

      if (fisrtNode.type === MarkdownNodeType.WhiteSpace) continue

      lineEnd = Number(key)

      break
    }

    let endIndex = nodes.findIndex((n) => n._parentId === lineEnd) - 1

    if (lineEnd === -1) {
      endIndex = nodes.length - 1
    }

    if (endIndex === -1) {
      throw new MarkdownSyntaxError('Component block is not closed')
    }

    return {
      children: nodes.slice(0, endIndex),
      endIndex
    }
  }

  public process: MarkdownNodeProcessor['process'] = (nodes) => {
    const result: MarkdownNode[] = []

    const copyNodes = [...nodes]

    while (copyNodes.length) {
      const current = copyNodes[0]

      if (!this.isOpening(copyNodes)) {
        result.push(current)
        copyNodes.shift()
        continue
      }

      const { children, endIndex } = this.mountChildren(copyNodes)

      const node = new MarkdownNode({
        _parentId: nodes[0]._parentId,
        type: MarkdownNodeType.ComponentBlock,
        data: {
          children
        }
      })

      result.push(node)

      copyNodes.splice(0, endIndex)
    }

    return result
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
