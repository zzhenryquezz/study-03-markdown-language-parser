<script setup lang="ts">
import type MarkdownNode from '@/parser-markdown/MarkdownNode';
import MarkdonwParser from '@/parser-markdown/MarkdownParser';
import { computed, onMounted, ref, watch } from 'vue';

import debounce from 'lodash/debounce';

// model
const modelValue = defineProp<MarkdownNode>('modelValue')
const update = defineEmit('update:modelValue')

const model = computed({
    get: () => modelValue.value,
    set: (value) => update(value)
});

// text
const el = ref<HTMLElement>()
const text = ref('')

function mountText(children: MarkdownNode[]) {
    return children.map(c => c.data.value).join('');
}

const setText = debounce(() => {

    const currentText = mountText(model.value.data.children)
    const html = (el.value?.innerText || '') + '\n';
    
    if (html.trim() === currentText.trim()) return;
    
    text.value = mountText(model.value.data.children).trim();
    
}, 100);




watch(model, setText, { immediate: true });


// update

function onUpdate() {

    const parser = new MarkdonwParser();

    const content = el.value?.innerText || '';

    parser.setTokensByText(content);

    const [node] = parser.toMarkdownNodes();

    const last = model.value.data.children[model.value.data.children.length - 1];

    node.data.children.push(last)

    model.value = {
        ...model.value,
        data: {
            children: node.data.children
        }
    }
}


</script>
<template>
    <p ref="el" contenteditable @input="onUpdate" class="focus:outline-none" @keydown.enter.prevent>
        {{ text }}
    </p>
</template>