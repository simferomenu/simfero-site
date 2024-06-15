<template>
  <div
    class="relative flex flex-col h-[350px] w-[calc(50%-40px)] md:w-[calc(33%-40px)] xl:w-[calc(25%-40px)] box-border rounded-[19px] menu-card-bg mr-[40px] mb-[40px] shrink-0 pointer-events-auto default-transition animated"
    :class="{ 'active-menu-card border-animation': isProductInOrder }"
    @click="onChoose"
    ref="cardElement"
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
          {{ product.name }}
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
          v-if="isProductInOrder"
          isBlack
          class="pointer-events-auto"
          :quantity="product.amount"
          @update="onProductCounterUpdate"
          @empty="onDeleteFromOrder"
        />
        <IconPlus
          ref="iconPlus"
          v-else-if="!isProductInOrder"
          :isBlack="true"
          @click="onAddToOrder"
        />
      </Transition>
    </div>
  </div>
  <!-- <div
    class="relative flex flex-col h-[350px] w-[calc(50%-40px)] md:w-[calc(33%-40px)] xl:w-[calc(25%-40px)] box-border rounded-[19px] menu-card-bg mr-[40px] mb-[40px] shrink-0 pointer-events-auto default-transition animated-long"
    ref="cardElement"
  >
    <div class="relative h-[145px] w-full shrink-0">
      <div
        class="absolute w-[183px] h-[183px] top-[-30px] left-[-25px] overflow-hidden flex rounded-full bg-[#fff]"
      ></div>
    </div>
    <div class="h-full w-full box-border p-[17px] flex flex-col justify-between">
      <div class="flex flex-col">
        <div class="w-[50%] h-[15px] bg-darkBlue opacity-20 rounded-full"></div>
        <div class="w-[30%] h-[15px] bg-darkBlue opacity-20 rounded-full mt-[10px]"></div>
      </div>
      <div class="w-[30%] h-[15px] bg-darkBlue opacity-20 rounded-full"></div>
    </div>
  </div> -->
</template>

<style scoped></style>

<script setup>
import { ref, watch, defineEmits, defineProps, onMounted, onBeforeUnmount, computed } from 'vue'
import { IconPlus, Counter } from '@/components'
import { useOrderStore } from '@/stores/order.store';
import { useProductsStore } from '@/stores/products.store';

const isImageLoaded = ref(false)
const isCardReady = ref(false)

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


const emit = defineEmits(['choose', 'order-update', 'expand'])

const onChoose = () => emit('choose', props.product)

const isProductInOrder = computed(() => {
  if (props.product.amount>0) {
    return true
  } else {
    return false
  }
})

const isDescrHidden = ref(false)
const productName = ref(null)
const description =
  props.product.description ||
  'Каждый раз, когда вы пробуете это блюдо, вы погружаетесь в мир вкуса и наслаждения. Вы чувствуете, как все ваши чувства оживают, а душа наполняется радостью и счастьем.'

const cardElement = ref(null)

const handleVisibilityChange = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const cardId = entry.target.getAttribute('data-id')
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
  setTimeout(() => {
    if (cardElement.value) {
      if (productName.value && productName.value.clientHeight > 48) {
        isDescrHidden.value = true
      }
    }
  })
})

const orderStore = useOrderStore()
const productsStore = useProductsStore()

onBeforeUnmount(() => {
  if (observer && cardElement.value) {
    observer.unobserve(cardElement.value)
  }
})

// Попытка слежения за localstorage заказа и изменения isProductInOrder

// watch(
//   () => isProductInOrder.value,
//   () => {
//     console.log(JSON.parse(window.localStorage.getItem('order')))
//     console.log(isProductInOrder.value)
//     const orderProducts = JSON.parse(window.localStorage.getItem('order'))
//     let [arrayKey, value] = Object.entries(orderProducts)[1]
//     let orderProductsArr = value
//     for (let i = 0; i < orderProductsArr.length; i++) {
//       if ((orderProductsArr[i].id = props.product.id)) {
//         isProductInOrder.value = true
//         console.log('yes')
//       }
//     }
//     if ((orderProductsArr.length = 0)) {
//       isProductInOrder.value = false
//     }
//   }
// )

const onAddToOrder = (event) => {
  event && event.stopPropagation()
  productsStore.productsList[props.groupIndex].subGroups[props.subGroupIndex].products[props.cardIndex].amount=1
  orderStore.orderInfo.orderAmount++
  orderStore.order.push(productsStore.productsList[props.groupIndex].subGroups[props.subGroupIndex].products[props.cardIndex])
  isProductInOrder.value=true
  // const rawOrderData = window.localStorage.getItem('order')
  // const selectedTables = window.localStorage.getItem('selectedTables')

  // try {
  //   let order = null

  //   if (rawOrderData) {
  //     order = JSON.parse(rawOrderData)
  //     const product = order.products.find((p) => p.id === props.product.id)

  //     if (product) {
  //       product.amount = amount
  //     } else {
  //       order.products.push({ ...props.product, amount })
  //     }
  //   } else {
  //     order = {
  //       tables: [...JSON.parse(selectedTables)],
  //       products: [{ ...props.product, amount }]
  //     }
  //   }

  //   isProductInOrder.value = true
  //   window.localStorage.setItem('order', JSON.stringify(order))

  //   emit('order-update')
  // } catch (error) {
  //   console.log('Ошибка добавления в заказа', error)
  // }
}

const onDeleteFromOrder = () => {
  const rawOrderData = window.localStorage.getItem('order')

  try {
    let order = JSON.parse(rawOrderData)
    order.products = order.products.filter((p) => p.id !== props.product.id)
    isProductInOrder.value = false
    window.localStorage.setItem('order', JSON.stringify(order))
    emit('order-update')
  } catch (error) {
    console.log('Ошибка удаления из заказа', error)
  }
}

const onProductCounterUpdate = (iterator) => {
  const indexInOrder = orderStore.order.map(e => e.id).indexOf(props.product.id);
  orderStore.order[indexInOrder].amount += iterator
  orderStore.orderInfo.orderAmount += iterator
  if (orderStore.order[indexInOrder].amount == 0) {
    isProductInOrder.value=false
    orderStore.order.splice(indexInOrder, 1)
  }
}
</script>
