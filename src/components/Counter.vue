<template>
  <div
    class="reltive flex items-center box-border px-[8px] py-[12px] w-fit h-[45px] bg-gold rounded-tl-[33px] rounded-tr-[33px] rounded-br-[33px]"
  >
    <div class="flex justify-center items-center h-full w-auto" @click="quantity--">
      <img src="/icons/IconMinus.svg" alt="" />
    </div>
    <div
      class="font-Segoe font-semibold text-[18px] tracking-[0.15em] uppercase text-[#000] text-center mx-[15px]"
    >
      {{ quantity }}
    </div>
    <div class="flex justify-center items-center h-full w-auto" @click="quantity++">
      <img src="/icons/IconPlusBlack.svg" alt="" />
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { ref } from 'vue'

defineProps({
  quantity: Number
})
</script>
