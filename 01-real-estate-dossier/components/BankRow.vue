<template>
  <div class="group flex items-center justify-between px-2 py-1.5 rounded text-xs cursor-pointer transition-all duration-150 hover:bg-[#ebebeb] hover:-translate-y-[1px]"
    :class="highlight ? 'bg-[#982121]/7 border border-[#982121]/14 hover:border-[#982121]/25' : 'border border-transparent hover:border-[#982121]/18'">
    <span :class="highlight ? 'text-[#982121]/72' : 'text-[#1f2021]/50'">{{ label }}</span>
    <div class="flex items-center gap-2">
      <span :class="{
        'text-[#982121] font-medium': positive,
        'text-[#982121] font-medium': highlight,
        'text-[#1f2021] font-semibold': strong,
        'text-[#1f2021]/68': !positive && !highlight && !strong
      }">{{ value }}</span>
      <svg class="w-3.5 h-3.5 text-[#9f8989] transition-all duration-150 group-hover:text-[#982121] group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
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
