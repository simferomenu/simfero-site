<template>
  <div
    class="relative flex flex-col h-[350px] w-[calc(50%-40px)] xs:w-[calc(33%-40px)] md:w-[calc(25%-40px)] box-border rounded-[19px] order-card-bg shrink-0 pointer-events-auto default-transition mb-[40px] mr-[40px] animated-up"
    :style="{ opacity: product.isOrdered ? '0.7!important' : 1 }"
    @click="onChoose"
  >
    <div class="relative h-[145px] w-full shrink-0">
      <div
        class="absolute w-[183px] h-[183px] top-[-30px] left-[-25px] overflow-hidden rounded-[100px]"
      >
        <img :src="product.imageLinks[0] || '/images/ImageBasicDish.png'" alt="" />
      </div>
<!--      <div class="absolute w-[5px] h-auto top-[11px] right-[13px]">-->
<!--        <img src="/icons/IconThreeDotsWhite.svg" alt="" />-->
<!--      </div>-->
    </div>
    <div class="h-full w-full box-border p-[17px] flex flex-col justify-between">
      <span
        ref="productName"
        class="font-Segoe font-semibold text-[16px] leading-[150%] tracking-[0.12em] uppercase text-[#fff]"
      >
        {{ product.name }}
      </span>
      <span
        class="font-Segoe font-[350] text-[14px] leading-[136%] text-gold clip-4"
        v-if="!isDescrHidden"
      >
        {{ description }}
      </span>
      <span class="font-Segoe font-bold text-[20px] leading-[115%] tracking-[0.03em] text-[#fff]">
        {{ product.sizePrices[0].price.currentPrice }} Руб.
      </span>
      <div class="flex items-center font-[600] align-center justify-center box-border px-[8px] py-[12px] w-[35px] h-[35px] bg-gold rounded-[33px] absolute right-[-10px] bottom-0 z-[3] pointer-events-none pointer-events-auto">
        {{product.amount}}
      </div>
      <Counter
        v-if='!product.isOrdered'
        class="pointer-events-auto"
        :quantity="product.amount"
        @update="onProductCounterUpdate"
      />
      <IconPlus v-if='!product.isOrdered'/>
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { ref, onMounted } from 'vue'
import { IconPlus, Counter } from '@/components'
import { useOrderStore } from '@/stores/order.store';

const props = defineProps({
  product: {
    type: Object
  },
  index: {
    type: Number
  },
  orderItemsPosition: {
    type: Object
  }
})

const emit = defineEmits(['chooseFromOrder', 'order-update'])

const isProductInOrder = ref(props.product.selected)
const orderStore = useOrderStore()
const isDescrHidden = ref(false)
const productName = ref(null)
const description =
  props.product.description ||
  'Каждый раз, когда вы пробуете это блюдо, вы погружаетесь в мир вкуса и наслаждения. Вы чувствуете, как все ваши чувства оживают, а душа наполняется радостью и счастьем.'

const onChoose = () => emit('chooseFromOrder', props.product)

onMounted(() => {
  if (productName.value.clientHeight > 48) {
    isDescrHidden.value = true
  }
})

const onProductCounterUpdate = (iterator) => {
  const indexInOrder = orderStore.preOrder.map((e) => e.id).indexOf(props.product.id)
  orderStore.preOrder[indexInOrder].amount += iterator
  orderStore.orderInfo.prevOrderAmount = orderStore.orderInfo.orderAmount;
  orderStore.orderInfo.orderAmount += iterator
  if (orderStore.preOrder[indexInOrder].amount == 0) {
    isProductInOrder.value = false
    orderStore.preOrder.splice(indexInOrder, 1)
  }
}
</script>
