<script setup lang="ts">
import type MainNode from '@/parser-main/MainNode';
import type MarkdownNode from '@/parser-markdown/MarkdownNode';
import MarkdonwParser from '@/parser-markdown/MarkdownParser';
import { computed, onMounted, ref, watch } from 'vue';

import NodeHeading from './NodeHeading.vue';

const modelValue = defineProp<MainNode[]>('modelValue')
const update = defineEmit('update:modelValue')

const model = computed({
    get: () => modelValue.value,
    set: (value) => update(value)
});

// components

const parser = new MarkdonwParser();

const markdownNodes = ref<MarkdownNode[]>([]);

function setMarkdownNodes() {
    parser.setTokensByNodes(model.value);

    markdownNodes.value = parser.toMarkdownNodes();
}

watch(model, setMarkdownNodes, { immediate: true });

</script>
<template>
    <div class="h-full w-full p-4 overflow-auto">

        <template v-for="(node, index) in markdownNodes">
            <node-heading v-if="node.type === 'Heading'" :model-value="node" />

            <br v-else-if="node.type === 'BreakLine'" />

            <div v-else>{{  node  }}</div>
        </template>
    </div>
</template>