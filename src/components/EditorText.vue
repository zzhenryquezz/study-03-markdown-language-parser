<script setup lang="ts">
import { useEditor } from '@/composables/editor';
import { computed } from 'vue';

const editor = useEditor()

const text = computed({
    get: () => editor.toText(),
    set: (value) => editor.updateFromText(value)
});

</script>
<template>
    <textarea
        class="w-full min-h-full p-4 bg-black text-white" 
        v-model="text"       
    />
</template>