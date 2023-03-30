<script setup lang="ts">
import { useEditor } from '@/composables/editor'
import type MarkdownNode from '@/parser-markdown/MarkdownNode'
import MarkdonwParser from '@/parser-markdown/MarkdownParser'
import { computed, ref, watch } from 'vue'

import NodeHeading from './NodeHeading.vue'
import NodeParagraph from './NodeParagraph.vue'

const editor = useEditor()

const nodes = computed({
  get: () => editor.nodes,
  set: (value) => editor.updateFromNodes(value)
})

// components

const parser = new MarkdonwParser()
const markdownNodes = ref<MarkdownNode[]>([])

function load() {
  parser.setTokensByNodes(nodes.value)

  markdownNodes.value = parser.toMarkdownNodes()
}

watch(nodes, load, { immediate: true })

// update

function onMarkdownNodeUpdate(index: number, node: MarkdownNode) {
  markdownNodes.value.forEach((n, i) => {
    if (i === index) {
      n.type = node.type
      n.data = node.data
    }
  })

  const mainNodes = parser.convertMarkdownNodesToMainNodes(markdownNodes.value)

  editor.updateFromNodes(mainNodes)
}
</script>
<template>
  <div class="h-full w-full py-4 overflow-auto">
    <template v-for="(node, index) in markdownNodes" :key="index">
      <node-heading
        v-if="node.type === 'Heading'"
        :model-value="node"
        :md-index="index"
        @update:model-value="(v) => onMarkdownNodeUpdate(index, v)"
      />

      <node-paragraph
        v-else-if="['BreakLine', 'Paragraph'].includes(node.type)"
        :model-value="node"
        :md-index="index"
        @update:model-value="(v) => onMarkdownNodeUpdate(index, v)"
      />

      <div v-else>{{ node }}</div>
    </template>
  </div>
</template>
