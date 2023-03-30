import type MainNode from '@/parser-main/MainNode'
import MarkdownNode, { MarkdownNodeType } from '@/parser-markdown/MarkdownNode'
import MarkdonwParser from '@/parser-markdown/MarkdownParser'
import { createEventHook } from '@vueuse/core'
import { computed, inject, provide, reactive, ref } from 'vue'
import merge from 'lodash/merge'

export function createMdBlocks() {
  const blocks = ref<MarkdownNode[]>([])
  const blocksFocusMethod = new Map<number, () => void>()

  const onUpdate = createEventHook()

  const parser = new MarkdonwParser()

  function load(nodes: MainNode[]) {
    parser.setTokensByNodes(nodes)

    blocks.value = parser.toMarkdownNodes()
  }

  function updateBlock(index: number, payload: MarkdownNode) {
    blocks.value.forEach((n, i) => {
      if (i === index) {
        n.type = payload.type
        n.data = payload.data
      }
    })

    onUpdate.trigger({ index, payload })
  }

  function addBlock(index: number, payload: MarkdownNode, autofocus = false) {
    blocks.value.splice(index, 0, payload)

    onUpdate.trigger({ index, payload })

    if (!autofocus) return

    setTimeout(() => {
      const method = blocksFocusMethod.get(index)

      if (method) method()
    }, 100)
  }

  function addEmptyBlock(index: number, autofocus = false) {
    const payload = new MarkdownNode({
      type: MarkdownNodeType.Paragraph,
      _parentId: -1,
      data: {
        children: [
          {
            type: MarkdownNodeType.BreakLine,
            data: {
              value: '\n'
            }
          }
        ]
      }
    })

    addBlock(index, payload, autofocus)
  }

  function destroyBlock(index: number) {
    blocks.value.splice(index, 1)

    onUpdate.trigger({ index, payload: null })
  }

  function toMainNodes() {
    return parser.convertMarkdownNodesToMainNodes(blocks.value)
  }

  return reactive({
    blocks,
    blocksFocusMethod,

    load,
    updateBlock,
    addBlock,
    addEmptyBlock,
    destroyBlock,
    toMainNodes,

    onUpdate: onUpdate.on
  })
}

export function provideMdBlocks() {
  const mdBlocks = createMdBlocks()

  provide('mdBlocks', mdBlocks)

  return mdBlocks
}

export function useMdBlocks() {
  return inject('mdBlocks', createMdBlocks())
}

export function useMdBlock<D = MarkdownNode['data']>(indexOrNode: number | MarkdownNode) {
  const mdBlocks = useMdBlocks()

  if (!mdBlocks) throw new Error('No mdBlocks provided')

  let index = -1

  if (typeof indexOrNode === 'number') {
    index = indexOrNode
  }

  if (indexOrNode instanceof MarkdownNode) {
    index = mdBlocks.blocks.indexOf(indexOrNode)
  }

  if (index === -1) throw new Error('Invalid index')

  const value = computed<MarkdownNode<D> | null>(() => mdBlocks.blocks[index])

  function update(payload: Partial<MarkdownNode>) {
    mdBlocks.updateBlock(index, merge({}, value.value, payload))
  }

  function setFocusMethod(method: () => void) {
    mdBlocks.blocksFocusMethod.set(index, method)
  }

  return reactive({
    value,
    update,
    setFocusMethod
  })
}
