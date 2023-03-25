<script setup lang="ts">
import type MainNode from '@/parser-main/MainNode';
import type MarkdownNode from '@/parser-markdown/MarkdownNode';
import MarkdonwParser from '@/parser-markdown/MarkdownParser';
import { computed, onMounted, ref, watch } from 'vue';

const modelValue = defineProp<MainNode[]>('modelValue')
const update = defineEmit('update:modelValue')

const model = computed({
    get: () => modelValue.value,
    set: (value) => update(value)
});

// components

const parser = new MarkdonwParser();
const components = ref([])

function setComponents(){
    parser.setTokensByNodes(model.value);

    const markdowNodes = parser.toMarkdownNodes();

    while(markdowNodes.length) {
        const node = markdowNodes[0];

        
        console.log(node);

        markdowNodes.shift();
    }

}

onMounted(() => {
    setComponents();
})

</script>
<template>
    <div class="h-full w-full p-4 overflow-auto">

        <div v-for="(node, index) in model">
            {{ node.content }}
        </div>
    </div>
</template>