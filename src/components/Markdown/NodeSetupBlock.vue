<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMdBlock } from '@/composables/md-blocks'
import MarkdownNode, { MarkdownNodeType } from '@/parser-markdown/MarkdownNode'
import MarkdonwParser from '@/parser-markdown/MarkdownParser'

// block

interface BlockData {
  children: MarkdownNode[]
}

const mdIndex = defineProp<number>('mdIndex', {
  required: true
})

const block = useMdBlock<BlockData>(mdIndex.value)

// text
const text = ref('')
const parser = new MarkdonwParser()

function setText() {
  if (!block.value || !block.value.data?.children) return

  const firstLine = block.value.data.children[0]._parentId

  const children: MarkdownNode[] = block.value.data.children.filter(
    (child) => child._parentId !== firstLine
  )

  let content = parser.convertMarkdownNodesToText(children)

  content = content
    .split('\n')
    .map((line) => line.replace(/^ {4}/, ''))
    .join('\n')

  if (text.value === content) return

  if (text.value.length) return

  text.value = content
}

watch(() => block.value, setText, { immediate: true })

function onTextUpdate() {
  if (!block.value || !block.value.data?.children) return

  const content = text.value
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n')

  parser.setTokensByText(content)

  const firstLine = block.value.data.children[0]._parentId

  const children = block.value.data.children
    .filter((child) => child._parentId === firstLine)
    .concat(parser.toMarkdownNodes())

  const last = children[children.length - 1]

  console.log(children.length, block.value.data.children.length)

  const data = { children }

  console.log(children)

  block.update({ data })
}

watch(text, onTextUpdate)
</script>
<template>
  <div class="flex flex-wrap w-full">
    <div class="mb-2">Setup</div>

    <textarea v-model.lazy="text" class="bg-black w-full min-h-[300px] p-4 rounded" />
  </div>
</template>
