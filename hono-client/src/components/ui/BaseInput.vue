<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :placeholder="placeholder"
    class="px-4 py-2 rounded-full border border-[#d9ceb9] bg-white focus:outline-none focus:ring-2 focus:ring-[#ff8c42]"
  />
</template>

<script setup>
defineProps(['modelValue', 'placeholder'])
defineEmits(['update:modelValue'])
</script>