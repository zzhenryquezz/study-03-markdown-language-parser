import type MainNode from '@/parser-main/MainNode'
import MarkdonwParser from '@/parser-markdown/MarkdownParser'
import { inject, provide, reactive, ref, type UnwrapRef } from 'vue'

export function createEditor() {
  const original = ref('')
  const nodes = ref<MainNode[]>([])
  const parser = new MarkdonwParser()

  function toText() {
    return original.value
  }

  function updateFromText(payload: string) {
    original.value = payload

    parser.setTokensByText(payload)

    nodes.value = parser.toNodes()
  }

  function updateFromNodes(payload: MainNode[]) {
    const old = JSON.parse(JSON.stringify(nodes.value))

    parser.setTokensByNodes(payload)

    original.value = parser.toText()

    nodes.value = parser.toNodes()

    const newNodes = JSON.parse(JSON.stringify(nodes.value))

    old.forEach((n: any, i: number) => {
      if (!newNodes[i]) {
        console.log('node removed', n)
        return
      }

      if (n.type !== newNodes[i].type) {
        console.log('type changed', n.type, newNodes[i].type)
      }

      if (n._parentId !== newNodes[i]._parentId) {
        console.log('parent changed', n._parentId, newNodes[i]._parentId)
      }

      if (JSON.stringify(n.data) !== JSON.stringify(newNodes[i].data)) {
        console.log('data changed', n.data, newNodes[i].data)
      }
    })
  }

  return reactive({
    original: original as any as UnwrapRef<typeof original>,
    nodes: nodes as any as UnwrapRef<typeof nodes>,
    toText,
    updateFromText,
    updateFromNodes
  })
}

export function useEditor() {
  return inject('editor', createEditor())
}

export function provideEditor() {
  const editor = createEditor()

  provide('editor', editor)

  return editor
}
