<script setup lang="ts">
import type MarkdownNode from '@/parser-markdown/MarkdownNode'
import { computed, onMounted, ref, watch } from 'vue'

import NodeBlock from './NodeBlock.vue'

// model
const mdIndex = defineProp<number>('mdIndex', {
  required: true
})

const modelValue = defineProp<MarkdownNode>('modelValue')
const update = defineEmit('update:modelValue')

const model = computed({
  get: () => modelValue.value,
  set: (value) => update(value)
})

// text
const text = ref('')
const el = ref<HTMLElement>()

function setText() {
  if (text.value === model.value.data.value) return

  if (el.value?.innerText === model.value.data.value) return

  text.value = model.value.data.value
}

function onTextUpdate() {
  model.value.data.value = el.value?.innerText || ''

  model.value = { ...model.value }
}

watch(() => model.value.data.value, setText, { immediate: true })

// Level

const blockRef = ref<InstanceType<typeof NodeBlock>>()

const level = ref(1)
const tag = computed(() => `h${level.value}`)

function setLevel() {
  if (level.value === model.value.data.level) return

  level.value = model.value.data.level
}

function onLevelUpdate(value: number) {
  model.value.data.level = value

  model.value = { ...model.value }

  if (blockRef.value) blockRef.value.show = false
}

watch(() => model.value.data.level, setLevel, { immediate: true })
</script>
<template>
  <node-block ref="block" :block="model" :mdIndex="mdIndex">
    <template #actions>
      <list-item v-for="l in 6" :key="l" @click="onLevelUpdate(l)">
        {{ `To H${l}` }}
      </list-item>
    </template>
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
  </node-block>
</template>
