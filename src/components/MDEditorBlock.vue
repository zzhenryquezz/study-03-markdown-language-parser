<script setup lang="ts">
import type MDNode from '@/markdown/MDNode'
import { MDNodeType } from '@/markdown/MDNode'
import { computed } from 'vue'

import MDEditorBlockHeading from './MDEditorBlockHeading.vue'

const modelValue = defineProp<MDNode>('modelValue', {
  required: true
})

const updateModel = defineEmit('update:modelValue')

const model = computed({
  get: () => modelValue.value,
  set: (value) => updateModel(value)
})
</script>
<template>
  <div v-if="model" class="w-full flex items-center group">
    <v-btn class="mr-2 opacity-0 group-hover:opacity-100">
      <i-drag size="20" />
    </v-btn>
    <MDEditorBlockHeading v-if="model.type === MDNodeType.Heading" v-model="model" />
  </div>
</template>
