<template>
  <div class="space-y-0.5">
    <span class="block text-[10px] text-white/25 uppercase tracking-wider">{{ label }}</span>
    <span class="block text-xs text-white/70">{{ value }}</span>
  </div>
</template>

<script setup>
defineProps({ label: String, value: String })
</script>
