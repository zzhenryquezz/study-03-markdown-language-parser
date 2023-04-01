import type MDNode from '@/markdown/MDNode'
import MDParser from '@/markdown/MDParser'
import { inject, provide, reactive, ref } from 'vue'

export function createEditor() {
  const nodes = ref<MDNode[]>([])
  const parser = new MDParser()

  function toTokens(payload: string) {
    const tokens = parser.toTokens(payload)

    // remove eof
    tokens.pop()

    return tokens
  }

  function toText() {
    return nodes.value.map((n) => n.toText()).join('')
  }

  function updateFromText(payload: string) {
    nodes.value = parser.toNodes(payload)
  }

  function updateFromNodes(payload: MDNode[]) {
    nodes.value = payload
  }

  return reactive({
    nodes,
    parser,

    toText,
    toTokens,
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
