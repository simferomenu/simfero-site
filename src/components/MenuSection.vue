<template>
  <div class="relative w-full flex flex-col">
    <div class="w-full flex items-center mb-[50px] animated-long">
      <span
        class="font-semibold text-[#000] uppercase text-[25px] leading-[117%] tracking-[0.11em] font-Sitka mr-[14px] block shrink-0 w-fit"
      >
        {{ name }}
      </span>
      <div class="relative w-full flex shrink-1 items-center">
        <img class="block h-[15px] w-auto" src="/icons/IconRhombusBlack.svg" alt="" />
        <div class="h-[1px] w-full bg-[#000]"></div>
      </div>
    </div>
    <div class="relative w-full flex flex-wrap">
      <slot> </slot>
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  // id: {
  //   type: Number
  // },
  // groupIndex: {
  //   type: Number
  // }
})

const toTuna = () => {
  router.push('dish/tuna')
}
</script>
