<template>
  <div
    class="h-screen w-screen overflow-hidden fixed top-0 left-0 z-[1000] waiter-bg flex flex-col"
  >
    <div
      class="flex items-center fixed top-[35px] shrink-0 z-[10] cursor-pointer right-[35px] gap-[16px]"
      @click="emit('close')"
    >
      <span class="text-[#D2AF96] text-[20px] font-Segoe font-normal">ЗАКРЫТЬ</span>
      <img src="/icons/IconCrossAlt.svg" alt="close" class="w-[27px] h-[27px]" />
    </div>
    <div class="flex flex-col items-center justify-center py-[9vw] w-full h-full">
      <div class="imageBorder w-auto max-h-full">
        <img
          src="/images/PromotionImage.jpg?date=050925"
          alt="promotion-image"
          class="w-full h-full rounded-[20px]"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['close'])
</script>

<style scoped>
.imageBorder {
  background: linear-gradient(#d2af96 0%, #d2af96 100%);
  padding: 2px;
  border-radius: 20px;
}
</style>
