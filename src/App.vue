<script setup lang="ts">
import { watch } from 'vue'

// Components
import EditorText from './components/EditorText.vue'
import MDEditor from './components/MDEditor.vue'

import { provideEditor } from './composables/editor'
import { useLocalStorage } from '@vueuse/core'
import { useFixturesFiles } from './tests/helpers'

const editor = provideEditor()

const options = useFixturesFiles()

const selected = useLocalStorage('selected', options[0].name)

watch(
  selected,
  (value) => {
    const file = options.find((option) => option.name === value)

    if (file) {
      editor.updateFromText(file.content)
    }
  },
  { immediate: true }
)
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

    <div class="w-6/12 bg-gray-800 text-white border-l">
      <div class="text-2xl font-bold px-8 py-4">Vue components</div>

      <div class="h-[calc(100%_-_64px)]">
        <MDEditor />
      </div>
    </div>
  </div>
</template>
