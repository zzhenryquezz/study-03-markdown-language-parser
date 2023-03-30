<script setup lang="ts">
import { useEditor } from '@/composables/editor'
import { provideMdBlocks } from '@/composables/md-blocks'
import { MarkdownNodeType } from '@/parser-markdown/MarkdownNode'
import type MarkdownNode from '@/parser-markdown/MarkdownNode'
import MarkdonwParser from '@/parser-markdown/MarkdownParser'
import { computed, ref, watch } from 'vue'

import NodeBlock from './NodeBlock.vue'

import NodeHeading from './NodeHeading.vue'
import NodeParagraph from './NodeParagraph.vue'

const editor = useEditor()

const nodes = computed({
  get: () => editor.nodes,
  set: (value) => editor.updateFromNodes(value)
})

// markdown

const mdBlocks = provideMdBlocks()

watch(nodes, () => mdBlocks.load(nodes.value), { immediate: true })

// update

function onBlocksUpdate() {
  editor.updateFromNodes(mdBlocks.toMainNodes())
}

mdBlocks.onUpdate(onBlocksUpdate)
</script>
<template>
  <div class="h-full w-full py-4 overflow-auto">
    <node-block v-for="(node, index) in mdBlocks.blocks" :key="index" :md-index="index">
      <node-heading
        v-if="node.type === MarkdownNodeType.Heading"
        :model-value="node"
        :md-index="index"
      />

      <node-paragraph v-else-if="node.type === MarkdownNodeType.Paragraph" :md-index="index" />

      <div v-else>{{ node }}</div>
    </node-block>
  </div>
</template>
