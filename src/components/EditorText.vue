<script setup lang="ts">
import { computed } from 'vue';

const modelValue = defineProp<string>('modelValue')
const update = defineEmit('update:modelValue')

const model = computed({
    get: () => modelValue.value,
    set: (value) => update(value)
});

</script>
<template>
    <textarea class="w-full min-h-full p-4 bg-black text-white" v-model="model"></textarea>
</template>