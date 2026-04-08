<template>
  <div class="flex items-start gap-2.5 px-3 py-2.5 rounded-lg border"
    :class="{
      'bg-[#ffe7e7] border-[#d64545]/28': level === 'high',
      'bg-[#fff3f3] border-[#d64545]/20': level === 'medium',
      'bg-[#ffffff] border-[#9f8989]/18': level === 'low',
      'bg-emerald-50 border-emerald-200': level === 'info',
    }">
    <div class="mt-0.5 shrink-0">
      <div class="w-1.5 h-1.5 rounded-full mt-0.5"
        :class="{
          'bg-[#d64545]': level === 'high',
          'bg-[#d64545]': level === 'medium',
          'bg-[#9f8989]': level === 'low',
          'bg-emerald-500': level === 'info',
        }"></div>
    </div>
    <span class="text-xs leading-relaxed"
      :class="{
        'text-[#982121]/90': level === 'high',
        'text-[#982121]/84': level === 'medium',
        'text-[#1f2021]/62': level === 'low',
        'text-emerald-800/80': level === 'info',
      }">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  level: { type: String, default: 'low' }, // high | medium | low | info
  text: String,
})
</script>
