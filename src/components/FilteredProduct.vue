<template>
  <div
    class="relative w-full flex justify-between box-border pb-[20px] border-solid border-b-[#fff] border-b-[1px]"
  >
    <div class="relative flex flex-col justify-between">
      <span class="font-Segoe font-semibold text-[16px] tracking-[0.06em] uppercase text-[#fff]"
        >{{product.name}}</span
      >
      <span class="font-Segoe font-[350] text-[14px] tracking-[0.05em] text-[#fff]"
        >{{ product.weight }} г.</span
      >
    </div>
    <span class="font-Segoe font-semibold text-[16px] tracking-[0.06em] uppercase text-gold shrink-0 ml-[20px]"
      >{{ product.sizePrices[0].price.currentPrice }} РУБ.</span
    >
  </div>
</template>

<script setup>

const props = defineProps({
  product: {
    type: Object
  }
})
</script>
