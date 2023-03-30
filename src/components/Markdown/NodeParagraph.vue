<script setup lang="ts">
import type MarkdownNode from '@/parser-markdown/MarkdownNode'
import MarkdonwParser from '@/parser-markdown/MarkdownParser'
import { computed, onMounted, ref, watch } from 'vue'

import debounce from 'lodash/debounce'

import NodeBlock from './NodeBlock.vue'
import { MarkdownNodeType } from '@/parser-markdown/MarkdownNode'

// model
const modelValue = defineProp<MarkdownNode>('modelValue')
const update = defineEmit('update:modelValue')

const model = computed({
  get: () => modelValue.value,
  set: (value) => update(value)
})

// text
const el = ref<HTMLElement>()
const text = ref('')

function mountText(children?: MarkdownNode[]) {
  if (!children) return ''

  return children.map((c) => c.data.value).join('')
}

const setText = debounce(() => {
  const currentText = mountText(model.value.data.children)
  const html = (el.value?.innerText || '') + '\n'

  if (html.trim() === currentText.trim()) return

  text.value = mountText(model.value.data.children).trim()

  if (el.value?.innerText === text.value) return

  el.value!.innerText = text.value
}, 100)

watch(model, setText, { immediate: true })

// update

function trasnformToBreakLine() {
  model.value = {
    _parentId: model.value._parentId,
    type: MarkdownNodeType.BreakLine,
    data: {
      children: []
    }
  }
}

function trasnformToParagraph(children: MarkdownNode[]) {
  const last = children[children.length - 1]

  if (last.type !== MarkdownNodeType.BreakLine) {
    children.push({
      _parentId: model.value._parentId,
      type: MarkdownNodeType.BreakLine,
      data: {
        value: '\n'
      }
    })
  }

  model.value = {
    _parentId: model.value._parentId,
    type: MarkdownNodeType.Paragraph,
    data: {
      children
    }
  }
}

function onUpdate() {
  const parser = new MarkdonwParser()

  const content = el.value?.innerText || ''

  parser.setTokensByText(content)

  const [node] = parser.toMarkdownNodes()

  if (!node || !node.data) {
    trasnformToBreakLine()
    return
  }

  if (!node.data.children || !node.data.children.length) {
    trasnformToBreakLine()
    return
  }

  trasnformToParagraph(node.data.children)
}

// editor actions
const blockRef = ref<InstanceType<typeof NodeBlock>>()

const mdIndex = defineProp<number>('mdIndex', {
  required: true
})

onMounted(() => {
  if (!el.value) return

  if (!model.value.data.autofocus) return

  el.value.focus()
})
</script>
<template>
  <node-block ref="blockRef" :block="model" :md-index="mdIndex">
    <p
      ref="el"
      contenteditable
      @input="onUpdate"
      class="focus:outline-none w-full"
      @keydown.enter.prevent
    >
      {{ text }}
    </p>
  </node-block>
</template>
