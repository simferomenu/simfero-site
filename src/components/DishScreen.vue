<template>
  <div
    class="fixed top-0 left-0 flex flex-col justify-between w-screen h-screen dish-bg box-border py-[40px] overflow-hidden z-[6]"
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
          class="font-Segoe font-semibold text-[38px] leading-[133%] tracking-[0.06em] uppercase text-[#fff] mb-[15px] w-[80%]"
        >
          {{ product.name }}
        </div>
        <span class="simple-text">
          {{ description }}
        </span>
        <div
          class="relative flex w-full items-center justify-between h-[107px] mt-[15px]"
          v-if="fpcAmount[0].amount != 0"
        >
          <div class="absolute top-0 right-0 h-[1px] bg-[#fff] w-[100%] mr-[2.5%]"></div>
          <div class="flex flex-col items-center">
            <span class="simple-text mb-[8px]">Жиры</span>
            <span class="bold-text">{{ product.fatAmount }}</span>
          </div>
          <div class="top-[10px] right-0 w-[1px] bg-[#fff] h-[60%]"></div>
          <div class="flex flex-col items-center">
            <span class="simple-text mb-[8px]">Белки</span>
            <span class="bold-text">{{ product.proteinsAmount }}</span>
          </div>
          <div class="top-[10px] right-0 w-[1px] bg-[#fff] h-[60%]"></div>
          <div class="flex flex-col items-center mr-[7.5%]">
            <span class="simple-text mb-[8px]">Углеводы</span>
            <span class="bold-text">{{ product.carbohydratesAmount }}</span>
          </div>
          <div class="absolute bottom-0 right-0 h-[1px] bg-[#fff] w-[100%] mr-[2.5%]"></div>
        </div>
        <!-- <div
          v-for="fpc of filteredFpc"
          :key="fpc.name"
          class="relative w-full flex justify-between pb-[20px] mt-[45px] border-solid border-b-[1px] border-b-gold"
        >
          <span
            class="font-Segoe text-[#fff] font-semibold uppercase text-[16px] leading-[200%] tracking-[0.07em]"
            >{{ fpc.name }}:</span
          >
          <span
            class="font-Segoe text-[#fff] font-semibold uppercase text-[16px] leading-[200%] tracking-[0.07em]"
          >
            {{ fpc.amount }}</span
          >
        </div> -->
        <div class="relative w-full flex items-center justify-between mt-[30px]">
          <div class="relative h-full flex flex-col justify-between">
            <span
              class="font-Segoe font-semibold text-[24px] leading-[110%] tracking-[0.03em] upppercase text-[#fff]"
              >{{ product.sizePrices[0].price.currentPrice }} Руб.</span
            >
            <span
              class="font-Segoe font-semibold text-[21px] leading-[110%] tracking-[0.03em] upppercase text-darkGold mt-[18px]"
              >{{ product.weight }} {{ product.weightMeasure }}</span
            >
          </div>
          <AddButton v-if="!isProductInOrder && isButtonVisible" @select="addToOrder" />
          <AddButtonActive
            v-if="isProductInOrder && cardInfo && isButtonVisible"
            @update="onProductCounterUpdate"
            :cardInfo="cardInfo"
            :quantity="props.product.amount"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
// import { Swiper, SwiperSlide } from 'swiper/vue'
import { AddButton, AddButtonActive, IconCross } from '@/components'
import { useProductsStore } from '@/stores/products.store'
import { useOrderStore } from '@/stores/order.store'
import { useBusinessStore } from '@/stores/business.store'

const props = defineProps({
  product: {
    type: Object
  }
})

const fpcAmount = ref([
  { name: 'Белки', amount: props.product.proteinsAmount },
  { name: 'Жиры', amount: props.product.fatAmount },
  { name: 'Углеводы', amount: props.product.carbohydratesAmount }
])

const productsStore = useProductsStore()
const businessStore = useBusinessStore()
const isButtonVisible = ref(null)
const orderStore = useOrderStore()
const cardInfo = ref()
const isBusinessProduct = ref(null)
const isProductInOrder = computed(() => {
  const index = orderStore.preOrder.map((e) => e.id).indexOf(props.product.id)
  if (index == -1) {
    return false
  } else {
    return true
  }
})

if (props.product.subGroupIndex == null) {
  isButtonVisible.value = true
} else if (businessStore.isCurrentDaySelected && businessStore.isBusinessAvailable) {
  isButtonVisible.value = true
}

const description =
  props.product.description ||
  'Каждый раз, когда вы пробуете это блюдо, вы погружаетесь в мир вкуса и наслаждения. Вы чувствуете, как все ваши чувства оживают, а душа наполняется радостью и счастьем.'

// const navigation = ref({
//   enabled: true,
//   nextEl: '.dish-button-next',
//   prevEl: '.dish-button-prev'
// })

// const scrollbar = ref({
//   enabled: true,
//   el: '.dish-scrollbar'
// })

const addToOrder = () => {
  if (isBusinessProduct.value) {
    businessStore.businessProducts.subGroups[props.product.subGroupIndex].daysOfWeek[
      props.product.dayIndex
    ][props.product.productIndex].amount = 1
    orderStore.preOrder.push(
      businessStore.businessProducts.subGroups[props.product.subGroupIndex].daysOfWeek[
        props.product.dayIndex
      ][props.product.productIndex]
    )
  } else {
    productsStore.productsList[cardInfo.value.groupIndex].subGroups[
      cardInfo.value.subGroupIndex
    ].products[cardInfo.value.cardIndex].amount = 1
    orderStore.preOrder.push(
      productsStore.productsList[cardInfo.value.groupIndex].subGroups[cardInfo.value.subGroupIndex]
        .products[cardInfo.value.cardIndex]
    )
  }
  isProductInOrder.value = true
  orderStore.orderInfo.prevOrderAmount = orderStore.orderInfo.orderAmount;
  orderStore.orderInfo.orderAmount++
}

const onProductCounterUpdate = (iterator) => {
  const indexInOrder = orderStore.preOrder.map((e) => e.id).indexOf(props.product.id)
  if (orderStore.order[indexInOrder].amount == 1 && iterator == -1) {
    if (isBusinessProduct.value) {
      businessStore.businessProducts.subGroups[props.product.subGroupIndex].daysOfWeek[
        props.product.dayIndex
      ][props.product.productIndex].amount += iterator
    } else {
      productsStore.productsList[cardInfo.value.groupIndex].subGroups[
        cardInfo.value.subGroupIndex
      ].products[cardInfo.value.cardIndex].amount += iterator
    }
    orderStore.orderInfo.prevOrderAmount = orderStore.orderInfo.orderAmount;
    orderStore.orderInfo.orderAmount += iterator
    orderStore.preOrder.splice(indexInOrder, 1)
    isProductInOrder.value = false
  } else {
    if (isBusinessProduct.value) {
      businessStore.businessProducts.subGroups[props.product.subGroupIndex].daysOfWeek[
        props.product.dayIndex
      ][props.product.productIndex].amount += iterator
    } else {
      productsStore.productsList[cardInfo.value.groupIndex].subGroups[
        cardInfo.value.subGroupIndex
      ].products[cardInfo.value.cardIndex].amount += iterator
    }
    orderStore.orderInfo.prevOrderAmount = orderStore.orderInfo.orderAmount;
    orderStore.orderInfo.orderAmount += iterator
  }
}

onMounted(() => {
  if (props.product.subGroupIndex != null) {
    isBusinessProduct.value = true
    cardInfo.value = {
      cardIndex: props.product.productIndex,
      subGroupIndex: props.product.subGroupIndex,
      dayIndex: props.product.dayIndex
    }
  }
  if (props.product.amount != 0) {
    isProductInOrder.value = true
  }
  if (!isBusinessProduct.value) {
    for (const group of productsStore.productsList) {
      const groupIndex = productsStore.productsList.indexOf(group)
      for (const subGroup of group.subGroups) {
        const subGroupIndex = group.subGroups.indexOf(subGroup)
        const index = subGroup.products.map((e) => e.id).indexOf(props.product.id)
        if (index != -1) {
          cardInfo.value = {
            cardIndex: index,
            groupIndex: groupIndex,
            subGroupIndex: subGroupIndex
          }
        }
      }
    }
  }
})
</script>

<style scoped></style>
