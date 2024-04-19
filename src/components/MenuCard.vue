<template>
  <div
    class="relative flex flex-col h-[350px] w-[calc(50%-40px)] md:w-[calc(33%-40px)] xl:w-[calc(25%-40px)] box-border rounded-[19px] menu-card-bg mr-[40px] mb-[40px] shrink-0 pointer-events-auto default-transition"
    :class="{ 'active-menu-card border-animation': isProductInOrder }"
    @click="onChoose"
  >
    <div class="menu-card-border"></div>
    <div class="relative h-[145px] w-full shrink-0">
      <div
        class="absolute w-[183px] h-auto top-[-30px] left-[-25px] overflow-hidden rounded-[100px]"
      >
        <img :src="product.imageLinks[0] || '/images/ImageBasicDish.png'" alt="" />
      </div>
      <div class="absolute w-[5px] h-auto top-[11px] right-[13px]">
        <img src="/icons/IconThreeDots.svg" alt="" />
      </div>
    </div>
    <div class="h-full w-full box-border p-[17px] flex flex-col justify-between">
      <span
        class="font-Segoe font-semibold text-[16px] leading-[150%] tracking-[0.12em] uppercase text-[#000]"
        >{{ product.name }}</span
      >
      <span class="font-Segoe font-bold text-[20px] leading-[115%] tracking-[0.03em] text-darkBlue">
        {{ product.sizePrices[0].price.currentPrice }} Руб.
      </span>
      <Counter
        v-show="isProductInOrder"
        isBlack
        class="pointer-events-auto"
        :class="{ 'animated-counter': isProductInOrder }"
        :quantity="1"
        @update="onProductCounterUpdate"
      />
      <IconPlus v-show="!isProductInOrder" :isBlack="true" @click="onAddToOrder" />
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { ref, defineEmits } from 'vue'
import { IconPlus, Counter } from '@/components'

const props = defineProps({
  product: {
    type: Object
  }
})

const emit = defineEmits(['choose'])

const isProductInOrder = ref(false)

const onChoose = () => emit('choose', props.product)

const onAddToOrder = (event) => {
  event.stopPropagation()

  const rawOrderData = window.localStorage.getItem('order')
  const selectedTables = window.localStorage.getItem('selectedTables')

  try {
    let order = null

    if (rawOrderData) {
      order = JSON.parse(rawOrderData)
    } else {
      order = {
        tables: [...JSON.parse(selectedTables)]
      }
    }

    isProductInOrder.value = true
    console.log(order)
  } catch (error) {
    console.log('Ошибка добавления в заказа', error)
  }
}

const onProductCounterUpdate = (value) => {
  console.log(value)
}
</script>
