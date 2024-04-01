<template>
  <div :class="checkColor">
    <img v-if="isBlack" class="h-[21px] w-[21px]" src="/icons/IconPlusGold.svg" alt="" />
    <img v-else class="h-[21px] w-[21px]" src="/icons/IconPlusBlack.svg" alt="" />
  </div>
</template>

<style scoped></style>

<script setup>
import { computed } from 'vue'

const checkColor = computed(() => {
  return props.isBlack
    ? 'absolute bg-[#000] w-[71px] h-[45px] bottom-[20px] right-[-7%] flex justify-center items-center rounded-tl-[33px] rounded-tr-[33px] rounded-br-[33px]'
    : 'absolute bg-[#D2AF96] w-[71px] h-[45px] bottom-[20px] right-[-7%] flex justify-center items-center rounded-tl-[33px] rounded-tr-[33px] rounded-br-[33px]'
})
const props = defineProps({
  isBlack: {
    type: Boolean
  }
})
</script>
