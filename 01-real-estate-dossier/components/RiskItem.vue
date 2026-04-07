<template>
  <div class="flex items-start gap-2.5 px-3 py-2.5 rounded-lg border"
    :class="{
      'bg-red-500/[0.06] border-red-500/20': level === 'high',
      'bg-amber-500/[0.06] border-amber-500/20': level === 'medium',
      'bg-white/[0.03] border-white/[0.07]': level === 'low',
      'bg-blue-500/[0.04] border-blue-500/15': level === 'info',
    }">
    <div class="mt-0.5 shrink-0">
      <div class="w-1.5 h-1.5 rounded-full mt-0.5"
        :class="{
          'bg-red-400': level === 'high',
          'bg-amber-400': level === 'medium',
          'bg-white/25': level === 'low',
          'bg-blue-400': level === 'info',
        }"></div>
    </div>
    <span class="text-xs leading-relaxed"
      :class="{
        'text-red-300/80': level === 'high',
        'text-amber-300/80': level === 'medium',
        'text-white/50': level === 'low',
        'text-blue-300/70': level === 'info',
      }">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  level: { type: String, default: 'low' }, // high | medium | low | info
  text: String,
})
</script>
