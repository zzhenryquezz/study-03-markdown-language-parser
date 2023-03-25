<script setup lang="ts">
import { computed } from 'vue';


// model
const modelValue = defineProp<string>('modelValue')
const update = defineEmit('update:modelValue')

const model = computed({
    get: () => modelValue.value,
    set: (value) => update(value)
});

// level
const level = defineProp<number>('level', {
    required: true,
})

const tag = computed(() => `h${level.value}`)


</script>
<template>
    <component :is="tag" >
        {{ model }}
    </component>
</template>