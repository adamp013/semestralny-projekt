<!-- src/components/ui/Button.vue -->
<template>
  <button
    :class="['btn', `btn--${variant}`, `btn--${size}`, { 'btn--loading': loading }]"
    :disabled="disabled || loading"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="btn__spinner" />
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',         // 'primary' | 'secondary' | 'danger'
  },
  size: {
    type: String,
    default: 'md',              // 'sm' | 'md' | 'lg'
  },
  loading: Boolean,
  disabled: Boolean,
})

defineEmits(['click'])
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.btn--primary  { background: #ff8c42; color: #111; }
.btn--secondary { background: #6d6875; color: white; }
.btn--danger   { background: #ef4444; color: white; }

.btn--sm { padding: 6px 12px; font-size: 13px; }
.btn--md { padding: 10px 18px; font-size: 15px; }
.btn--lg { width: 100%; padding: 14px 24px; font-size: 17px; justify-content: center; }

.btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>