<template>
  <div class="relative w-full mb-[55px]">
    <span
      class="font-semibold text-[#000] uppercase text-[25px] leading-[117%] tracking-[0.11em] font-Sitka"
    >
      Выберите {{ subGroup.name }}
    </span>
  </div>
  <div class="relative w-full flex flex-wrap">
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  subGroup: {
    type: Object
  }
})
</script>
