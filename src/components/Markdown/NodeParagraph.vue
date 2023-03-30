<script setup lang="ts">
import { ref, watch } from 'vue'
import debounce from 'lodash/debounce'

import type MarkdownNode from '@/parser-markdown/MarkdownNode'
import MarkdonwParser from '@/parser-markdown/MarkdownParser'

import { MarkdownNodeType } from '@/parser-markdown/MarkdownNode'
import { useMdBlock, useMdBlocks } from '@/composables/md-blocks'

// current block
const el = ref<HTMLElement>()

const mdIndex = defineProp<number>('mdIndex', {
  required: true
})

const mdBlock = useMdBlock(mdIndex.value)

function onUpdate() {
  const parser = new MarkdonwParser()

  const content = el.value?.innerText || ''

  parser.setTokensByText(content)

  const [node] = parser.toMarkdownNodes()

  const children = node?.data?.children || []

  const last = children[children.length - 1]

  if (last?.type !== MarkdownNodeType.BreakLine) {
    children.push({
      _parentId: mdBlock.value!._parentId,
      type: MarkdownNodeType.BreakLine,
      data: {
        value: '\n'
      }
    })
  }

  const payload = {
    type: MarkdownNodeType.Paragraph,
    data: { children }
  }

  mdBlock.update(payload)
}

mdBlock.setFocusMethod(() => el.value?.focus())

// all blocks

const mdBlocks = useMdBlocks()

function addBlockBellow() {
  mdBlocks.addEmptyBlock(mdIndex.value + 1, true)
}

function destroyBlock() {
  const htmlElText = el.value?.innerText || ''

  if (htmlElText.length) return

  mdBlocks.destroyBlock(mdIndex.value)
}

// text
const text = ref('')

function mountText(children?: MarkdownNode[]) {
  if (!children) return ''

  return children.map((c) => c.data.value).join('')
}

const setText = debounce(() => {
  const blockText = mountText(mdBlock.value?.data.children)
  const htmlElText = (el.value?.innerText || '') + '\n'

  if (htmlElText.trim() === blockText.trim()) return

  text.value = blockText.trim()

  if (el.value) {
    el.value.innerText = text.value
  }
}, 100)

watch(() => mdBlock.value, setText, { immediate: true })

// update
</script>
<template>
  <p
    ref="el"
    contenteditable
    @input="onUpdate"
    class="focus:outline-none w-full"
    @keydown.enter.prevent="addBlockBellow"
    @keydown.backspace="destroyBlock"
  >
    {{ text }}
  </p>
</template>
