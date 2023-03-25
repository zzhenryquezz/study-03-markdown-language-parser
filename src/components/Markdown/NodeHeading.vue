<script setup lang="ts">
import type MarkdownNode from '@/parser-markdown/MarkdownNode';
import { computed, onMounted, ref, watch } from 'vue';


// model
const modelValue = defineProp<MarkdownNode>('modelValue')
const update = defineEmit('update:modelValue')

const model = computed({
    get: () => modelValue.value,
    set: (value) => update(value)
});

// level
const level = ref(1)
const text = ref('')

const tag = computed(() => `h${level.value}`)

function setText() {
    text.value = model.value.data.value;
}

function setLevel() {
    level.value = model.value.data.level;
}

watch(model, setText, { immediate: true });
watch(model, setLevel, { immediate: true });


</script>
<template>
    <component :is="tag" >
        {{ text }}
    </component>
</template>