<template>
  <div>
    <p class="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{{ label }}</p>
    <p
      class="text-sm font-medium"
      :class="highlight ? 'text-slate-200' : 'text-slate-300'"
    >
      {{ value }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: String,
  highlight: {
    type: Boolean,
    default: false,
  },
})
</script>
