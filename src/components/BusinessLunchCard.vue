<template>
  <div
    class="relative flex flex-col h-[320px] w-[calc(50%-40px)] md:w-[calc(33%-40px)] xl:w-[calc(25%-40px)] box-border rounded-[19px] menu-card-bg mr-[40px] mb-[40px] shrink-0 pointer-events-auto default-transition animated"
    :class="{ 'active-menu-card border-animation': isActive }"
    ref="cardElement"
  >
    <div class="relative h-[145px] w-full shrink-0">
      <div
        class="absolute overflow-hidden rounded-[100px] animated flex justify-center items-center"
        :class="
          imgSrc !== '/icons/IconCancel.svg'
            ? 'w-[183px] h-[183px] top-[-30px] left-[-25px]'
            : 'top-0 left-0 w-[130px] h-[130px]'
        "
      >
        <img class="inner-img animated" :src="'/images/ImageBasicDish.png'" ref="cardImage" alt="" />
      </div>
    </div>
    <div class="h-full w-full box-border p-[17px] flex flex-col justify-between">
      <div class="relative flex flex-col">
        <span
          ref="productName"
          class="font-Segoe font-semibold text-[16px] leading-[150%] tracking-[0.12em] uppercase text-[#000] clip-5 mb-[5px]"
        >
          {{ product.name }}
        </span>
        <span
          class="font-Segoe font-[350] text-[14px] leading-[136%] text-darkBlue clip-4"
          v-if="!isDescrHidden"
        >
          {{ product.description }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  product: {
    type: Object
  }
})


const cardElement = ref(null)
const productName = ref(null)
const isDescrHidden = ref(false)

onMounted(() => {
  if (cardElement.value) {
    if (productName.value && productName.value.clientHeight > 48) {
      isDescrHidden.value = true
    }
  }
})
</script>
