<template>
  <div class="flex items-center justify-between py-2 px-3 bg-white/[0.03] rounded-md border border-white/[0.05]">
    <div>
      <span class="text-xs text-white/60">{{ month }}</span>
      <span v-if="note" class="ml-2 text-[9px] text-amber-400/70 bg-amber-400/10 px-1.5 py-0.5 rounded">{{ note }}</span>
    </div>
    <div class="flex gap-4 text-xs">
      <span class="text-white/30">Brut <span class="text-white/50">{{ gross }}</span></span>
      <span class="text-white/60 font-medium">Net {{ net }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({ month: String, gross: String, net: String, note: String })
</script>
