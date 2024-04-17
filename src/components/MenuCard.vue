<template>
  <div
    class="relative flex flex-col h-[350px] w-[230px] box-border rounded-[19px] menu-card-bg mr-[40px] mb-[40px] shrink-0 pointer-events-auto"
  >
    <div class="relative h-[145px] w-full shrink-0">
      <div
        class="absolute w-[183px] h-auto top-[-30px] left-[-25px] overflow-hidden rounded-[100px]"
      >
        <img :src="imgUrl" alt="" />
      </div>
      <div class="absolute w-[5px] h-auto top-[11px] right-[13px]">
        <img src="/icons/IconThreeDots.svg" alt="" />
      </div>
    </div>
    <div class="h-full w-full box-border p-[17px] flex flex-col justify-between">
      <span
        class="font-Segoe font-semibold text-[16px] leading-[150%] tracking-[0.12em] uppercase text-[#000]"
        >{{ name }}</span
      >
      <span class="font-Segoe font-bold text-[20px] leading-[115%] tracking-[0.03em] text-darkBlue">
        {{ price }} Руб.
      </span>
      <!-- <Counter class="pointer-events-auto" :quantity="3" /> -->
      <IconPlus :isBlack="true" />
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { IconPlus, Counter } from '@/components'
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
