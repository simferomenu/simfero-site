<template>
  <div
    class="relative flex flex-col h-[350px] w-[calc(50%-40px)] md:w-[calc(33%-40px)] xl:w-[calc(25%-40px)] box-border rounded-[19px] menu-card-bg mr-[40px] mb-[40px] shrink-0 pointer-events-auto default-transition animated"
    :class="{ 'active-menu-card border-animation': isProductInOrder }"
    @click="onSelect"
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
        <img class="h-[80px] w-[80px] z-[-1]" src="/icons/loadingBlack.gif" alt="" />
        <img
          @load="onImageLoad"
          class="inner-img animated"
          :src="imgSrc || '/images/ImageBasicDish.png'"
          ref="cardImage"
          v-show="isImageLoaded"
          alt=""
        />
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
      <span class="font-Segoe font-bold text-[20px] leading-[115%] tracking-[0.03em] text-darkBlue">
        {{ product.sizePrices[0].price.currentPrice }} руб
      </span>
      <Transition name="expand">
        <Counter
          v-if="
            isProductInOrder &&
            businessStore.isBusinessAvailable &&
            businessStore.isCurrentDaySelected &&
            productsStore.orderFunc == true
          "
          isBlack
          class="pointer-events-auto"
          :quantity="productAmount"
          @update="onProductCounterUpdate"
        />
        <IconPlus
          ref="iconPlus"
          v-else-if="
            !isProductInOrder &&
            businessStore.isBusinessAvailable &&
            businessStore.isCurrentDaySelected &&
            productsStore.orderFunc == true
          "
          :isBlack="true"
          @click="onAddToOrder($event)"
        />
      </Transition>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, computed } from 'vue'
import { useElementSize } from '@vueuse/core'
import { IconPlus, Counter } from '@/components'
import { useBusinessStore } from '@/stores/business.store'
import { useOrderStore } from '@/stores/order.store'
import { useProductsStore } from '@/stores/products.store'
const props = defineProps({
  product: {
    type: Object
  },
  imgSrc: {
    type: String
  },
  description: {
    type: String
  },
  day: {
    type: Number
  },
  isCardEmpty: {
    type: Boolean
  }
})

const emit = defineEmits(['select'])

const isImageLoaded = ref(false)

const productsStore = useProductsStore()

const productInfo = ref(props.product)
const businessStore = useBusinessStore()
const orderStore = useOrderStore()
const cardElement = ref(null)
const productName = ref(null)
const isDescrHidden = ref(false)

const onSelect = () => emit('select', productInfo.value)

productInfo.value.dayIndex = props.day

const onImageLoad = () => {
  isImageLoaded.value = true
}

const productAmount = computed(() => {
  const indexInOrder = orderStore.preOrder.map((e) => e.id).indexOf(props.product.id)
  return indexInOrder >= 0 && orderStore.preOrder[indexInOrder].amount
})
const isProductInOrder = computed(() => {
  if (
    !props.isCardEmpty &&
    businessStore.isCurrentDaySelected &&
    businessStore.isBusinessAvailable
  ) {
    const index = orderStore.preOrder.map((e) => e.id).indexOf(props.product.id)
    if (index == -1) {
      return false
    } else {
      return true
    }
  } else {
    return null
  }
})
const onAddToOrder = (event) => {
  event.stopPropagation()
  orderStore.preOrder.push(props.product)
  businessStore.businessProducts.subGroups[props.product.subGroupIndex].daysOfWeek[props.day][
    props.product.productIndex
  ].amount = 1
  orderStore.orderInfo.prevOrderAmount = orderStore.orderInfo.orderAmount
  orderStore.orderInfo.orderAmount += 1
  isProductInOrder.value = true
}
const onProductCounterUpdate = (iterator) => {
  const indexInOrder = orderStore.preOrder.map((e) => e.id).indexOf(props.product.id)
  orderStore.preOrder[indexInOrder].amount += iterator
  orderStore.orderInfo.prevOrderAmount = orderStore.orderInfo.orderAmount
  orderStore.orderInfo.orderAmount += iterator
  if (
    orderStore.preOrder[indexInOrder].amount == 0 &&
    businessStore.businessProducts.subGroups[props.product.subGroupIndex].daysOfWeek[props.day][
      props.product.productIndex
    ].amount == 0
  ) {
    isProductInOrder.value = false
    orderStore.preOrder.splice(indexInOrder, 1)
  }
}
watch(
  () => useElementSize(productName).height.value,
  () => {
    if (useElementSize(productName).height.value != 0) {
      if (useElementSize(productName).height.value < 72) {
        isDescrHidden.value = false
      } else {
        isDescrHidden.value = true
      }
    } else {
      isDescrHidden.value = false
    }
  }
)
</script>
