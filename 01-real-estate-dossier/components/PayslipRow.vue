<template>
  <div class="group flex items-center justify-between py-2 px-3 bg-[#ffffff] rounded-md border border-[#9f8989]/20 cursor-pointer transition-all duration-150 hover:bg-[#ebebeb] hover:border-[#982121]/25 hover:-translate-y-[1px]">
    <div>
      <span class="text-xs text-[#1f2021]/66">{{ month }}</span>
      <span v-if="note" class="ml-2 text-[9px] text-[#982121]/80 bg-[#982121]/8 px-1.5 py-0.5 rounded">{{ note }}</span>
    </div>
    <div class="flex items-center gap-4 text-xs">
      <span class="text-[#9f8989]">Brut <span class="text-[#1f2021]/60">{{ gross }}</span></span>
      <span class="text-[#1f2021]/75 font-medium">Net {{ net }}</span>
      <svg class="w-3.5 h-3.5 text-[#9f8989] transition-all duration-150 group-hover:text-[#982121] group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.7">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
</template>

<script setup>
defineProps({ month: String, gross: String, net: String, note: String })
</script>
