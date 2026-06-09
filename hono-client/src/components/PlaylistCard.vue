<template>
  <div 
    class="flex flex-col items-center w-[140px] cursor-pointer" 
    @click="$emit('click')"
  >
    <div :class="[
      'w-[120px] h-[120px] rounded-xl hover:shadow-2xl transition-all hover:scale-105 duration-300',
      selected ? 'bg-[#ff8c42]' : 'bg-[#8c8a9e]'
    ]">
    </div>
    <span class="text-[13px] mt-3 text-center">{{ name }}</span>
  </div>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>