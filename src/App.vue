<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

// Components
import EditorText from './components/EditorText.vue';
import EditorMarkdown from './components/Markdown/Editor.vue';
import type MainNode from './parser-main/MainNode';
import MainParser from './parser-main/MainParser';

import Content from '@/tests/fixtures/content.01.md?raw'
import { provideEditor } from './composables/editor';

// text

const text = ref(Content);

// main parser
const parser = new MainParser();
const nodes = ref<MainNode[]>([])

const editor = provideEditor()

function onEditorTextUpdate(value: string){
  editor.updateFromText(value)
}

onMounted(() => {
  editor.updateFromText(Content)
})


</script>
<template>
  <div class="h-screen w-screen flex overflow-hidden" >

    <div class="w-6/12 bg-black" >
      <EditorText  />
    </div>
    
    <div class="w-6/12 bg-teal-500" >
      <EditorMarkdown :model-value="editor.nodes"  />
    </div>

  </div>
</template>