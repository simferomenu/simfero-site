<template>
  <div
    class="relative flex flex-col h-[340px] w-[214px] box-border rounded-[19px] menu-card-bg mr-[40px] mb-[40px] shrink-0 pointer-events-auto"
  >
    <div class="relative h-1/2 w-full shrink-0">
      <div class="absolute w-full h-auto top-[-15%] left-[-15%]">
        <img :src="imgUrl" alt="" />
      </div>
      <!-- <div class="absolute w-[5px] h-auto top-[11px] right-[13px]">
        <img src="/icons/IconThreeDots.svg" alt="" />
      </div> -->
    </div>
    <div class="h-full w-full box-border p-[20px] flex flex-col justify-between">
      <span
        class="font-Segoe font-semibold text-[16px] leading-[150%] tracking-[0.17em] uppercase text-[#000]"
        >{{ name }}</span
      >
      <span
        class="font-Segoe font-semibold text-[18px] leading-[128%] tracking-[0.04em] text-[#000]"
      >
        {{ price }} Руб.
      </span>
      <IconPlus :isBlack="true" />
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
  price: {
    type: Number,
    required: true
  },
  imgUrl: String,
  required: true
})
</script>
