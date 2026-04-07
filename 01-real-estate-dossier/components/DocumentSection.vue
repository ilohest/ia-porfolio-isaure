<template>
  <div class="space-y-3">
    <div class="flex items-center gap-2">
      <span class="text-[11px] font-semibold text-white/50 uppercase tracking-wider">{{ title }}</span>
      <span v-if="badge" class="text-[9px] font-medium px-1.5 py-0.5 rounded"
        :class="{
          'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25': badgeColor === 'green',
          'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25': badgeColor === 'blue',
          'bg-violet-500/15 text-violet-400 border border-violet-500/25': badgeColor === 'purple',
          'bg-white/[0.05] text-white/35 border border-white/10': badgeColor === 'gray',
        }">
        {{ badge }}
      </span>
    </div>
    <div class="bg-white/[0.025] border border-white/[0.06] rounded-lg p-3.5">
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
