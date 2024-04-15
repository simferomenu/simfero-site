<template>
  <div
    class="relative flex flex-col items-center w-[216px] mr-[20px] mb-[20px] !pointer-events-auto"
  >
    <div class="relative h-[177px] w-full mb-[27px]">
      <div class="absolute w-full h-full flex justify-center items-center">
        <img class="h-full w-auto" src="/images/ImageTuna.png" alt="" />
      </div>
      <Counter :quantity="3" class="absolute right-0 bottom-0" />
    </div>
    <span
      class="font-Segoe text-[16px] font-semibold tracking-[0.17em] text-center text-[#fff] mb-[10px] uppercase box-border px-[10px]"
      >{{ name }}</span
    >
    <div
      class="flex items-center justify-center border-solid border-t-[1px] border-t-[#fff] w-[147px] font-Segoe font-semibold text-[21px] tracking-[0.03em] text-center text-darkGold box-border pt-[10px]"
    >
      {{ price }} Руб.
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { Counter } from '@/components'
import { ref } from 'vue'

const props = defineProps({
  name: {
    type: String
  },
  price: {
    type: Number
  }
})
</script>
