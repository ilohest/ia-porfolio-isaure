<template>
  <div class="flex items-center justify-between px-2 py-1.5 rounded text-xs"
    :class="highlight ? 'bg-amber-500/[0.06] border border-amber-500/15' : ''">
    <span :class="highlight ? 'text-amber-300/70' : 'text-white/40'">{{ label }}</span>
    <span :class="{
      'text-emerald-400 font-medium': positive,
      'text-amber-300 font-medium': highlight,
      'text-white/80 font-semibold': strong,
      'text-white/55': !positive && !highlight && !strong
    }">{{ value }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: String,
  positive: Boolean,
  highlight: Boolean,
  strong: Boolean,
})
</script>
