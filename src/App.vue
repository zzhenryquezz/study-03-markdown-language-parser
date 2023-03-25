<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

// Components
import EditorText from './components/EditorText.vue';
import EditorMarkdown from './components/Markdown/Editor.vue';
import type MainNode from './parser-main/MainNode';
import MainParser from './parser-main/MainParser';

import Content from '@/tests/fixtures/content.01.md?raw'

// text

const text = ref(Content);

function setText(value: string) {
  text.value = value;

  setNodes();
}

// main parser
const parser = new MainParser();
const nodes = ref<MainNode[]>([])

function setNodes(value: MainNode[] = []) {
  nodes.value = value
}

onMounted(() => {
  parser.setTokensByText(text.value);
  
  setNodes(parser.toNodes());
})

</script>
<template>
  <div class="h-screen w-screen flex overflow-hidden" >

    <div class="w-6/12 bg-black" >
      <EditorText :model-value="text" @update:modelValue="setText" />
    </div>
    
    <div class="w-6/12 bg-red-500" >
      <EditorMarkdown :model-value="nodes" @update:modelValue="setNodes" />
    </div>

  </div>
</template>