<template>
  <div
    class="relative flex flex-col h-[320px] w-[calc(50%-40px)] md:w-[calc(33%-40px)] xl:w-[calc(25%-40px)] box-border rounded-[19px] menu-card-bg mr-[40px] mb-[40px] shrink-0 pointer-events-auto default-transition animated"
    :class="{ 'active-menu-card border-animation': isProductInOrder }"
    ref="cardElement"
  >
    <div class="relative h-[145px] w-full shrink-0" @click="onSelect">
      <div
        class="absolute overflow-hidden rounded-[100px] animated flex justify-center items-center"
        :class="
          imgSrc !== '/icons/IconCancel.svg'
            ? 'w-[183px] h-[183px] top-[-30px] left-[-25px]'
            : 'top-0 left-0 w-[130px] h-[130px]'
        "
      >
        <img
          class="inner-img animated"
          :src="imgSrc || '/images/ImageBasicDish.png'"
          ref="cardImage"
          alt=""
        />
      </div>
    </div>
    <div class="h-full w-full box-border p-[17px] flex flex-col justify-between">
      <div class="relative flex flex-col" @click="onSelect">
        <span
          ref="productName"
          class="font-Segoe font-semibold text-[16px] leading-[150%] tracking-[0.12em] uppercase text-[#000] clip-5 mb-[5px]"
        >
          {{ title }}
        </span>
        <span
          class="font-Segoe font-[350] text-[14px] leading-[136%] text-darkBlue clip-4"
          v-if="!isDescrHidden"
        >
          {{ description }}
        </span>
      </div>
      <div v-if="businessStore.isCurrentDaySelected">
        <Transition name="expand">
          <Counter
            v-if="isProductInOrder"
            isBlack
            class="pointer-events-auto"
            :quantity="productAmount"
            @update="onProductCounterUpdate"
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
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { IconPlus, Counter } from '@/components'
import { useBusinessStore } from '@/stores/business.store'
import { useOrderStore } from '@/stores/order.store'
const props = defineProps({
  product: {
    type: Object
  },
  imgSrc: {
    type: String
  },
  name: {
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
const productInfo = ref(props.product)
productInfo.value.dayIndex = props.day
const onSelect = () => emit('select', productInfo.value)
const title = ref(null)
const businessStore = useBusinessStore()
const orderStore = useOrderStore()
const cardElement = ref(null)
const productName = ref(null)
const isDescrHidden = ref(false)
if (props.product.name.includes('ДО ')) {
  title.value = props.product.name.replace('ДО ', '')
} else {
  title.value = props.product.name
}
const productAmount = computed(() => {
  const indexInOrder = orderStore.preOrder.map((e) => e.id).indexOf(props.product.id)
  return indexInOrder >= 0 && orderStore.preOrder[indexInOrder].amount
})
const isProductInOrder = computed(() => {
  if (!props.isCardEmpty && businessStore.isCurrentDaySelected) {
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
const onAddToOrder = () => {
  orderStore.preOrder.push(props.product)
  businessStore.businessProducts.subGroups[props.product.subGroupIndex].daysOfWeek[props.day][
    props.product.productIndex
  ].amount = 1
  orderStore.orderInfo.orderAmount += 1
  isProductInOrder.value = true
}
const onProductCounterUpdate = (iterator) => {
  const indexInOrder = orderStore.preOrder.map((e) => e.id).indexOf(props.product.id)
  orderStore.order[indexInOrder].amount += iterator
  orderStore.orderInfo.orderAmount += iterator
  if (
    orderStore.order[indexInOrder].amount == 0 &&
    businessStore.businessProducts.subGroups[props.product.subGroupIndex].daysOfWeek[props.day][
      props.product.productIndex
    ].amount == 0
  ) {
    isProductInOrder.value = false
    orderStore.preOrder.splice(indexInOrder, 1)
  }
}
onMounted(() => {
  if (cardElement.value) {
    if (productName.value && productName.value.clientHeight > 48) {
      isDescrHidden.value = true
    }
  }
})
</script>
