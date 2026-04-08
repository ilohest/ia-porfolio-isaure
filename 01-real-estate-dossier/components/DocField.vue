<template>
  <div class="space-y-0.5">
    <span class="block text-[10px] text-[#9f8989] uppercase tracking-wider">{{ label }}</span>
    <span class="block text-xs text-[#1f2021]/78">{{ value }}</span>
  </div>
</template>

<script setup>
defineProps({ label: String, value: String })
</script>
