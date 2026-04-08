<template>
  <div class="p-3 rounded-lg border"
    :class="{
      'bg-[#ffffff] border-[#9f8989]/18': color === 'blue',
      'bg-[#fff1f1] border-[#d64545]/22 shadow-[inset_0_0_0_1px_rgba(214,69,69,0.04)]': color === 'amber',
      'bg-emerald-50 border-emerald-200 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.04)]': color === 'green',
      'bg-[#ffffff] border-[#9f8989]/18': color === 'default',
    }">
    <div class="text-[10px] text-[#9f8989] mb-1">{{ label }}</div>
    <div class="text-sm font-semibold mb-0.5"
      :class="{
        'text-[#1f2021]': color === 'blue',
        'text-[#982121]': color === 'amber',
        'text-emerald-700': color === 'green',
        'text-[#1f2021]': color === 'default',
      }">{{ value }}</div>
    <div class="text-[10px]"
      :class="{
        'text-[#9f8989]': color === 'blue' || color === 'default',
        'text-[#982121]/70': color === 'amber',
        'text-emerald-700/70': color === 'green',
      }">{{ sub }}</div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: String,
  sub: String,
  color: { type: String, default: 'default' },
})
</script>
