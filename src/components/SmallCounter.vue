<template>
  <div
    class="relative w-fit h-[28px] flex items-center justify-center overflow-hidden rounded-tl-[50px] rounded-tr-[33px] rounded-br-[33px] bg-gold box-border py-[5px] px-[15px] ml-[10px] translate-y-[-15px]"
  >
    <img class="h-[14px] w-[14px] mr-[5px]" src="/icons/IconSmallPlusBlack.svg" alt="" />
    <div class="font-Segoe font-semibold text-[18px] tracking-[0.15em] uppercase text-darkBlue">
      {{ value }}
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  value: Number
})
</script>

<style scoped></style>
