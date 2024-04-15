<template>
  <div class="relative w-[400px] h-[157px] flex items-center">
    <div class="h-full w-auto">
      <img class="w-auto h-full" src="/images/ImageSalad.png" alt="" />
    </div>
    <div
      class="absolute w-[325px] h-[134px] small-card-bg1 left-[55px] rounded-[19px] z-[-1] pl-[120px] py-[12px] box-border flex flex-col justify-between"
    >
      <span
        class="font-Segoe font-semibold text-[16px] leading-[150%] tracking-[0.17em] uppercase text-[#fff]"
        >{{ name }}</span
      >
      <span
        class="font-Segoe font-semibold text-[18px] leading-[128%] tracking-[0.04em] text-[#fff]"
      >
        1200 Руб.
      </span>
      <IconPlus />
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { IconPlus } from '@/components'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  bgColor: {
    type: String
  }
})
</script>
