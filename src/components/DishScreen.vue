<template>
  <div
    class="fixed top-0 left-0 flex flex-col justify-between w-screen h-screen dish-bg box-border py-[40px] overflow-hidden z-[4]"
  >
    <IconCross @click="$emit('closeDish')" />
    <div
      v-if="product"
      class="relative flex items-center shrink w-full box-border px-[20px] h-full"
    >
      <div
        class="relative max-h-full aspect-square w-full shrink z-[2] rounded-[50%] overflow-hidden"
      >
        <img
          class="inner-img"
          :src="product.imageLinks[0] || '/images/ImageBasicDish.png'"
          alt=""
        />
      </div>
      <div class="relative ml-[50px] w-[50%] shrink-0 flex flex-col">
        <div
          class="font-Segoe font-semibold text-[42px] leading-[133%] tracking-[0.06em] uppercase text-[#fff] mb-[15px] w-[80%]"
        >
          {{ product.name }}
        </div>
        <span class="simple-text">
          {{ description }}
        </span>
        <div class="relative flex w-full items-center justify-between h-[107px] mt-[15px]">
          <div class="absolute top-0 right-0 h-[1px] bg-[#fff] w-[70vw]"></div>
          <div class="flex flex-col items-center">
            <span class="simple-text mb-[8px]">Жиры</span>
            <span class="bold-text">{{ product.fatAmount }}</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="simple-text mb-[8px]">Белки</span>
            <span class="bold-text">{{ product.proteinsAmount }}</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="simple-text mb-[8px]">Углеводы</span>
            <span class="bold-text">{{ product.carbohydratesAmount }}</span>
          </div>
          <div class="absolute bottom-0 right-0 h-[1px] bg-[#fff] w-[70vw]"></div>
        </div>
        <AddButton :quantity="2" :isActive="false" class="mt-[30px] self-end" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, defineProps } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { SideMenu, MenuSmallCard, AddButton, IconCross } from '@/components'

const props = defineProps({
  product: {
    type: Object
  }
})
const description =
  props.product.description ||
  'Lorem Ipsum является текст-заполнитель обычно используется в графических, печать и издательской индустрии для предварительного просмотра макета и визуальных макетах.'

const navigation = ref({
  enabled: true,
  nextEl: '.dish-button-next',
  prevEl: '.dish-button-prev'
})

const scrollbar = ref({
  enabled: true,
  el: '.dish-scrollbar'
})
</script>

<style scoped></style>
