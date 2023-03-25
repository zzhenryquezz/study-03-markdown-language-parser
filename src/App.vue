<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

// Components
import EditorText from './components/EditorText.vue';
import EditorMarkdown from './components/Markdown/Editor.vue';
import type MainNode from './parser-main/MainNode';
import MainParser from './parser-main/MainParser';

import Content from '@/tests/fixtures/heading.03.md?raw'

// text

const text = ref(Content);

// main parser
const parser = new MainParser();
const nodes = ref<MainNode[]>([])

function setNodes() {
  parser.setTokensByText(text.value);

  nodes.value = parser.toNodes();
}

watch(text, setNodes, { immediate: true });

</script>
<template>
  <div class="h-screen w-screen flex overflow-hidden" >

    <div class="w-6/12 bg-black" >
      <EditorText v-model="text" />
    </div>
    
    <div class="w-6/12 bg-red-500" >
      <EditorMarkdown :model-value="nodes"  />
    </div>

  </div>
</template>