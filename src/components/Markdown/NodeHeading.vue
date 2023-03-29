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

// text
const level = ref(1)
const text = ref('')
const el = ref<HTMLElement>()

const tag = computed(() => `h${level.value}`)

function setText() {

    if (text.value === model.value.data.value) return;

    if (el.value?.innerText === model.value.data.value) return;

    text.value = model.value.data.value;
}

function setLevel() {
    if (level.value === model.value.data.level) return;

    level.value = model.value.data.level;
}

watch(() => model.value.data.value, setText, { immediate: true });
watch(() => model.value.data.level, setLevel, { immediate: true });


// update

function onUpdate() {
    model.value.data.value = el.value?.innerText || '';

    model.value = { ...model.value };
}


</script>
<template>
    <component ref="el" :is="tag" contenteditable="true" @input="onUpdate" class="focus:outline-none" @keydown.enter.prevent>
        {{ text }}
    </component>
</template>