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
          class="inner-img scale-105"
          :src="product.imageLinks[0] || '/images/ImageBasicDish2.png'"
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
        <div class="relative w-full flex items-center justify-between mt-[30px]">
          <div class="relative h-full flex flex-col justify-between">
            <span
              class="font-Segoe font-semibold text-[24px] leading-[110%] tracking-[0.03em] upppercase text-[#fff]"
              >{{ product.sizePrices[0].price.currentPrice }} Руб.</span
            >
            <span
              class="font-Segoe font-semibold text-[21px] leading-[110%] tracking-[0.03em] upppercase text-darkGold mt-[18px]"
              >{{ product.weight }} Г.</span
            >
          </div>
          <AddButton
            @click=addToOrder()
            :isActive="isProductInOrder"
            :quantity="props.product.amount"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, defineProps, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { SideMenu, MenuSmallCard, AddButton, IconCross } from '@/components'
import { useProductsStore } from '@/stores/products.store';
import { useOrderStore } from '@/stores/order.store';

const props = defineProps({
  product: {
    type: Object
  }
})

const productsStore = useProductsStore()
const orderStore = useOrderStore()
const cardInfo = ref()

const description =
  props.product.description ||
  'Каждый раз, когда вы пробуете это блюдо, вы погружаетесь в мир вкуса и наслаждения. Вы чувствуете, как все ваши чувства оживают, а душа наполняется радостью и счастьем.'

const navigation = ref({
  enabled: true,
  nextEl: '.dish-button-next',
  prevEl: '.dish-button-prev'
})

const scrollbar = ref({
  enabled: true,
  el: '.dish-scrollbar'
})

const isProductInOrder = computed(() => {
  if (props.product.amount>0) {
    return true
  } else {
    return false
  }
})

const addToOrder = () => {
  productsStore.productsList[cardInfo.value.groupIndex].subGroups[cardInfo.value.subGroupIndex].products[cardInfo.value.cardIndex].amount++
  orderStore.order.push(productsStore.productsList[cardInfo.value.groupIndex].subGroups[cardInfo.value.subGroupIndex].products[cardInfo.value.cardIndex])
  orderStore.orderInfo.orderAmount++
}

onMounted(() => {
  for (const group of productsStore.productsList) {
    const groupIndex = productsStore.productsList.indexOf(group)
    for (const subGroup of group.subGroups) {
      const subGroupIndex = group.subGroups.indexOf(subGroup)
      const index = subGroup.products.map(e=>e.id).indexOf(props.product.id)
      if (index!=-1) {
        cardInfo.value = {cardIndex: index, groupIndex: groupIndex, subGroupIndex:subGroupIndex}
      }
    }
  }
})
</script>

<style scoped></style>
