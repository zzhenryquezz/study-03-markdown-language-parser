<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { onClickOutside } from '@vueuse/core'
import { MarkdownNodeType } from '@/parser-markdown/MarkdownNode'
import { useMdBlock, useMdBlocks } from '@/composables/md-blocks'

// Menu
const show = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const btnRef = ref<HTMLElement | null>(null)
const position = ref({ x: 0, y: 0 })

const style = computed(() => {
  return {
    top: `${position.value.y + 24}px`,
    left: `${position.value.x}px`
  }
})

function onShow() {
  show.value = true
}

onMounted(() => {
  if (!btnRef.value) return

  const rect = btnRef.value.getBoundingClientRect()

  position.value.x = rect.x
  position.value.y = rect.y
})

onClickOutside(menuRef, () => {
  show.value = false
})

function destroyNode() {
  mdBlocks.destroyBlock(mdIndex.value)
}

// blocks
const mdIndex = defineProp<number>('mdIndex', {
  required: true
})

const mdBlocks = useMdBlocks()
const mdBlock = useMdBlock(mdIndex.value)

function addBlockBelow() {
  mdBlocks.addBlock(mdIndex.value + 1, {
    type: MarkdownNodeType.BreakLine,
    _parentId: -1,
    data: {
      text: '\n'
    }
  })

  show.value = false
}
</script>

<template>
  <section
    class="w-full flex items-center group group"
    :data-type="mdBlock.value?.type"
    :data-index="mdIndex"
  >
    <div class="w-8 flex justify-center opacity-0 group-hover:opacity-100">
      <button ref="btnRef" @click="onShow" class="hover:bg-black/10 p-[2px] rounded text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M9 20q-.825 0-1.413-.588T7 18q0-.825.588-1.413T9 16q.825 0 1.413.588T11 18q0 .825-.588 1.413T9 20Zm6 0q-.825 0-1.413-.588T13 18q0-.825.588-1.413T15 16q.825 0 1.413.588T17 18q0 .825-.588 1.413T15 20Zm-6-6q-.825 0-1.413-.588T7 12q0-.825.588-1.413T9 10q.825 0 1.413.588T11 12q0 .825-.588 1.413T9 14Zm6 0q-.825 0-1.413-.588T13 12q0-.825.588-1.413T15 10q.825 0 1.413.588T17 12q0 .825-.588 1.413T15 14ZM9 8q-.825 0-1.413-.588T7 6q0-.825.588-1.413T9 4q.825 0 1.413.588T11 6q0 .825-.588 1.413T9 8Zm6 0q-.825 0-1.413-.588T13 6q0-.825.588-1.413T15 4q.825 0 1.413.588T17 6q0 .825-.588 1.413T15 8Z"
          />
        </svg>
      </button>

      <teleport to="body">
        <div
          ref="menuRef"
          v-if="show"
          class="min-w-[200px] fixed bg-white rounded overflow-hidden"
          :style="style"
        >
          <list-item @click="destroyNode">Delete</list-item>
          <list-item @click="addBlockBelow">New block bellow</list-item>

          <slot name="actions" />
        </div>
      </teleport>
    </div>
    <slot />
  </section>
</template>
