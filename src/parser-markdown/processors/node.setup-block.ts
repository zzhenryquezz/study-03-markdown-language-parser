import MarkdownNode, { MarkdownNodeType } from '../MarkdownNode'
import type MarkdownNodeProcessor from '../MarkdownNodeProcessor'
import ComponentBlockProcessor from './node.component-block'

// this guy runs last
export default class SetupBlockProcessor extends ComponentBlockProcessor {
  public order = 10

  public process: MarkdownNodeProcessor['process'] = (nodes) => {
    if (!this.isOpening(nodes)) return nodes

    if (nodes[3].data.value !== 'setup') return nodes

    const { children, endIndex } = this.mountChildren(nodes)

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
