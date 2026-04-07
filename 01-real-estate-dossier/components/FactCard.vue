<template>
  <div class="p-3 rounded-lg border"
    :class="{
      'bg-blue-500/[0.05] border-blue-500/20': color === 'blue',
      'bg-amber-500/[0.05] border-amber-500/20': color === 'amber',
      'bg-emerald-500/[0.05] border-emerald-500/20': color === 'green',
      'bg-white/[0.03] border-white/[0.07]': color === 'default',
    }">
    <div class="text-[10px] text-white/30 mb-1">{{ label }}</div>
    <div class="text-sm font-semibold mb-0.5"
      :class="{
        'text-blue-300': color === 'blue',
        'text-amber-300': color === 'amber',
        'text-emerald-300': color === 'green',
        'text-white/80': color === 'default',
      }">{{ value }}</div>
    <div class="text-[10px] text-white/25">{{ sub }}</div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: String,
  sub: String,
  color: { type: String, default: 'default' },
})
</script>
