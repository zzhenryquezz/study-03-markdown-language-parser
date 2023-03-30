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
    parser.setTokensByNodes(payload)

    original.value = parser.toText()

    nodes.value = parser.toNodes()
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
