<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMdBlock } from '@/composables/md-blocks'

// block

interface BlockData {
  value: string
  level: number
}

const mdIndex = defineProp<number>('mdIndex', {
  required: true
})

const block = useMdBlock<BlockData>(mdIndex.value)

// text
const text = ref('')
const el = ref<HTMLElement>()

function setText() {
  if (text.value === block.value?.data?.value) return

  if (el.value?.innerText === block.value?.data?.value) return

  text.value = block.value?.data?.value || ''
}

function onTextUpdate() {
  const data = {
    value: el.value?.innerText || ''
  }

  block.update({ data })
}

watch(() => block.value?.data?.value, setText, { immediate: true })

// Level

const tag = computed(() => `h${block.value?.data?.level || 1}`)
</script>
<template>
  <component
    ref="el"
    :is="tag"
    contenteditable="true"
    @input="onTextUpdate"
    class="focus:outline-none"
    @keydown.enter.prevent
  >
    {{ text }}
  </component>
</template>
