<script setup lang="ts">
import { onMounted } from 'vue'

// Components
import EditorText from './components/EditorText.vue'
import EditorMarkdown from './components/Markdown/Editor.vue'

import Content from '@/tests/fixtures/heading.03.md?raw'
import { provideEditor } from './composables/editor'

const editor = provideEditor()

onMounted(() => {
  editor.updateFromText(Content)
})
</script>
<template>
  <div class="h-screen w-screen flex overflow-hidden">
    <div class="w-6/12 bg-gray-800 text-white">
      <div class="text-2xl font-bold px-8 py-4">Text</div>

      <div class="h-[calc(100%_-_64px)]">
        <EditorText />
      </div>
    </div>

    <div class="w-6/12 bg-gray-800 text-white">
      <div class="text-2xl font-bold px-8 py-4">Vue components</div>

      <div class="h-[calc(100%_-_64px)]">
        <EditorMarkdown />
      </div>
    </div>
  </div>
</template>
