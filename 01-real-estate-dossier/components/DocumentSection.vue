<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="section-title text-[11px] font-semibold text-[#1f2021]/72 uppercase tracking-wider">{{ title }}</span>
        <span v-if="badge" class="text-[9px] font-medium px-1.5 py-0.5 rounded"
          :class="{
            'bg-[#ffffff] text-[#982121] border border-[#982121]/20': badgeColor === 'green',
            'bg-[#ffffff] text-[#982121] border border-[#982121]/20': badgeColor === 'blue',
            'bg-[#ffffff] text-[#982121] border border-[#982121]/20': badgeColor === 'purple',
            'bg-[#ffffff] text-[#1f2021]/55 border border-[#1f2021]/10': badgeColor === 'gray',
          }">
          {{ badge }}
        </span>
      </div>
      <slot name="action" />
    </div>
    <div class="bg-[#ffffff] border border-[#9f8989]/22 rounded-lg p-3.5 shadow-[0_10px_30px_rgba(31,32,33,0.04)]">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  badge: String,
  badgeColor: { type: String, default: 'gray' },
})
</script>
