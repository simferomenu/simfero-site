<template>
  <div
    class="fixed top-0 left-0 flex flex-col justify-between w-screen h-screen dish-bg box-border py-[40px] overflow-hidden z-[3]"
  >
    <IconCross @click="$emit('closeDish')" />
    <div
      v-if="product"
      class="relative flex items-center shrink w-full box-border px-[20px] h-full"
    >
      <div class="relative max-h-full w-full shrink z-[2] rounded-[50%] overflow-hidden">
        <img
          class="max-h-full max-w-full h-auto w-full"
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
          {{ product.description }}
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

    <!--    <div class="relative flex flex-col shrink-0">-->
    <!--      <div class="relative flex justify-between w-full items-center px-[40px] mb-[20px]">-->
    <!--        <span-->
    <!--          class="font-Segoe block text-[#fff] font-semibold text-[18px] leading-[221%] tracking-[0.15em] uppercase"-->
    <!--          >С этой позицией берут</span-->
    <!--        >-->
    <!--        <div class="flex items-center">-->
    <!--          <div class="dish-scrollbar"></div>-->
    <!--          <div class="dish-button-prev ml-[30px]"></div>-->
    <!--          <div class="dish-button-next rotate-180 ml-[30px]"></div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="relative h-[158px] w-full">-->
    <!--        <swiper-->
    <!--          class="w-full h-full px-[40px]"-->
    <!--          :slidesPerView="'auto'"-->
    <!--          :spaceBetween="40"-->
    <!--          :navigation="navigation"-->
    <!--          :allowTouchMove="true"-->
    <!--          :scrollbar="scrollbar"-->
    <!--        >-->
    <!--          <swiper-slide class="h-fit w-fit">-->
    <!--            <MenuSmallCard name="Тунец Мацухиса" />-->
    <!--          </swiper-slide>-->
    <!--          <swiper-slide class="h-fit w-fit">-->
    <!--            <MenuSmallCard name="Тунец Мацухиса" />-->
    <!--          </swiper-slide>-->
    <!--          <swiper-slide class="h-fit w-fit">-->
    <!--            <MenuSmallCard name="Тунец Мацухиса" />-->
    <!--          </swiper-slide>-->
    <!--          <swiper-slide class="h-fit w-fit">-->
    <!--            <MenuSmallCard name="Тунец Мацухиса" />-->
    <!--          </swiper-slide>-->
    <!--        </swiper>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script setup>
import { onMounted, ref, defineProps } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { SideMenu, MenuSmallCard, AddButton, IconCross } from '@/components'

defineProps({
  product: {
    type: Object
  }
})

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
