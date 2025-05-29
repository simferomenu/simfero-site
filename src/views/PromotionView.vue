<template>
  <div class="h-screen w-screen overflow-hidden waiter-bg flex flex-col">
    <div
      class="flex items-center fixed top-[35px] cursor-pointer right-[35px] gap-[16px]"
      @click="toTheMenu"
    >
      <span class="text-[#D2AF96] text-[20px] font-Segoe font-normal">ЗАКРЫТЬ</span>
      <img src="/icons/IconCrossAlt.svg" alt="close" class="w-[27px] h-[27px]" />
    </div>
    <div class="flex flex-col items-center justify-center w-full h-full">
      <div class="imageBorder h-[600px] w-auto">
        <img
          src="/images/PromotionImage.png"
          alt="promotion"
          class="w-full h-full rounded-[20px]"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const toTheMenu = () => {
  router.push('/')
}
</script>

<style scoped>
.imageBorder {
  background: linear-gradient(#d2af96 0%, #d2af96 100%);
  padding: 2px;
  border-radius: 20px;
}
</style>
