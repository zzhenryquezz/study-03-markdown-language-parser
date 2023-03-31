<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

// Components
import EditorText from './components/EditorText.vue'
import EditorMarkdown from './components/Markdown/Editor.vue'

import { provideEditor } from './composables/editor'

const editor = provideEditor()

const files = import.meta.glob('@/tests/fixtures/*.md', {
  as: 'raw',
  eager: true
})

const selected = ref()

const options = Object.entries(files).map(([key, value]) => {
  const name = key.replace('/src/tests/fixtures/', '')

  return {
    name,
    value
  }
})

watch(selected, (name) => {
  const option = options.find((option) => option.name === name)

  if (!option) return

  editor.updateFromText(option.value)
})

selected.value = options[1].name
</script>
<template>
  <div class="h-screen w-screen flex overflow-hidden">
    <div class="w-6/12 bg-gray-800 text-white">
      <div class="text-2xl font-bold px-8 py-4 flex">
        Text

        <select v-model="selected" class="ml-auto text-gray-500 text-xs">
          <option v-for="option in options" :value="option.name" :key="option.name">
            {{ option.name }}
          </option>
        </select>
      </div>

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
