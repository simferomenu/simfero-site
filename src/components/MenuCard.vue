<template>
  <div
    class="relative flex flex-col h-[350px] w-[calc(50%-40px)] md:w-[calc(33%-40px)] xl:w-[calc(25%-40px)] box-border rounded-[19px] menu-card-bg mr-[40px] mb-[40px] shrink-0 pointer-events-auto default-transition animated"
    :class="{ 'active-menu-card border-animation': isProductInOrder }"
    ref="cardElement"
    @click="onChoose"
    v-if="product.isRendered"
  >
    <div class="relative h-[145px] w-full shrink-0">
      <div
        class="absolute w-[183px] h-[183px] top-[-30px] left-[-25px] overflow-hidden rounded-[100px] animated bg-[#fff] flex justify-center items-center"
      >
        <img class="h-[80px] w-[80px] z-[-1]" src="/icons/loadingBlack.gif" alt="" />
        <img
          class="inner-img animated"
          :src="product.imageLinks[0] || '/images/ImageBasicDish.png'"
          @load="onImageLoad"
          ref="cardImage"
          alt=""
          v-show="isImageLoaded"
        />
      </div>
      <!-- <div class="absolute w-[5px] h-auto top-[11px] right-[13px]">
        <img src="/icons/IconThreeDots.svg" alt="" />
      </div> -->
    </div>
    <div class="h-full w-full box-border p-[17px] flex flex-col justify-between">
      <div class="relative flex flex-col">
        <span
          ref="productName"
          class="font-Segoe font-semibold text-[16px] leading-[150%] tracking-[0.12em] uppercase text-[#000] clip-5 mb-[5px]"
        >
          {{ product.seoTitle || product.name }}
        </span>
        <span
          class="font-Segoe font-[350] text-[14px] leading-[136%] text-darkBlue clip-3"
          v-if="!isDescrHidden"
        >
          {{ description }}
        </span>
      </div>
      <span class="font-Segoe font-bold text-[20px] leading-[115%] tracking-[0.03em] text-darkBlue">
        {{ product.sizePrices[0].price.currentPrice }} Руб.
      </span>
      <Transition name="expand">
        <Counter
          @click="preventChoose($event)"
          v-if="isProductInOrder && productsStore.orderFunc == true"
          isBlack
          class="pointer-events-auto"
          :quantity="productAmount"
          @update="onProductCounterUpdate"
        />
        <IconPlus
          ref="iconPlus"
          v-else-if="!isProductInOrder && productsStore.orderFunc == true"
          :isBlack="true"
          @click="onAddToOrder($event)"
        />
      </Transition>
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { IconPlus, Counter } from '@/components'
import { useElementSize } from '@vueuse/core'
import { useOrderStore } from '@/stores/order.store'
import { useProductsStore } from '@/stores/products.store'

const isImageLoaded = ref(false)

const onImageLoad = () => {
  isImageLoaded.value = true
}

const props = defineProps({
  product: {
    type: Object
  },
  renderedCount: {
    type: Number
  },
  productsLength: {
    type: Number
  },
  cardIndex: {
    type: Number
  },
  subGroupIndex: {
    type: Number
  },
  groupIndex: {
    type: Number
  }
})

const preventChoose = (event) => {
  event.stopPropagation()
}

const emit = defineEmits(['choose', 'order-update', 'expand'])

const onChoose = () => emit('choose', props.product)

const isProductInOrder = computed(() => {
  const index = orderStore.preOrder.map((e) => e.id).indexOf(props.product.id)
  if (index == -1) {
    return false
  } else {
    return true
  }
})

const isDescrHidden = ref(false)
const productName = ref(null)
const description =
  props.product.description ||
  'Каждый раз, когда вы пробуете это блюдо, вы погружаетесь в мир вкуса и наслаждения. Вы чувствуете, как все ваши чувства оживают, а душа наполняется радостью и счастьем.'
const groupIndex = ref(props.groupIndex)
const subGroupIndex = ref(props.subGroupIndex)
const cardElement = ref(null)

const handleVisibilityChange = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const cardId = entry.target.getAttribute('data-id')
      if (
        cardId ==
        productsStore.productsList[groupIndex.value].subGroups[subGroupIndex.value].products
          .length -
          1
      ) {
        if (
          productsStore.productsList[groupIndex.value].subGroups[subGroupIndex.value + 1] != null
        ) {
          for (const product of productsStore.productsList[groupIndex.value].subGroups[
            subGroupIndex.value + 1
          ].products) {
            product.isRendered = true
          }
        }
      }
    }
  })
}

let observer = null
onMounted(() => {
  observer = new IntersectionObserver(handleVisibilityChange, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  })

  if (cardElement.value) {
    observer.observe(cardElement.value)
  }
})

const orderStore = useOrderStore()
const productsStore = useProductsStore()

onBeforeUnmount(() => {
  if (observer && cardElement.value) {
    observer.unobserve(cardElement.value)
  }
})

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

const onAddToOrder = (event) => {
  event && event.stopPropagation()

  productsStore.productsList[props.groupIndex].subGroups[props.subGroupIndex].products[
    props.cardIndex
  ].amount = 1

  orderStore.orderInfo.prevOrderAmount = orderStore.orderInfo.orderAmount
  orderStore.orderInfo.orderAmount++

  orderStore.preOrder.push(
    productsStore.productsList[props.groupIndex].subGroups[props.subGroupIndex].products[
      props.cardIndex
    ]
  )

  isProductInOrder.value = true
}

const productAmount = computed(() => {
  const indexInOrder = orderStore.preOrder.map((e) => e.id).indexOf(props.product.id)
  return indexInOrder >= 0 && orderStore.preOrder[indexInOrder].amount
})

const onProductCounterUpdate = (iterator) => {
  const indexInOrder = orderStore.preOrder.map((e) => e.id).indexOf(props.product.id)
  orderStore.preOrder[indexInOrder].amount += iterator
  orderStore.orderInfo.prevOrderAmount = orderStore.orderInfo.orderAmount
  orderStore.orderInfo.orderAmount += iterator

  if (orderStore.preOrder[indexInOrder].amount == 0) {
    isProductInOrder.value = false
    orderStore.preOrder.splice(indexInOrder, 1)
    console.log(orderStore.preOrder, orderStore.preOrder.length)
  }
}
</script>
