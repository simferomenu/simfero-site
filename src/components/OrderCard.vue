<template>
  <div
    class="relative flex flex-col h-[350px] w-[calc(50%-40px)] xs:w-[calc(33%-40px)] md:w-[calc(25%-40px)] box-border rounded-[19px] order-card-bg shrink-0 pointer-events-auto default-transition mb-[40px] mr-[40px] animated-up"
    @click="onChoose"
  >
    <div class="relative h-[145px] w-full shrink-0">
      <div
        class="absolute w-[183px] h-[183px] top-[-30px] left-[-25px] overflow-hidden rounded-[100px]"
      >
        <img :src="product.imageLinks[0] || '/images/ImageBasicDish.png'" alt="" />
      </div>
      <div class="absolute w-[5px] h-auto top-[11px] right-[13px]">
        <img src="/icons/IconThreeDotsWhite.svg" alt="" />
      </div>
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
      <Counter
        class="pointer-events-auto"
        :quantity="product.amount"
        @update="onProductCounterUpdate"
        @empty="onDeleteFromOrder"
      />
      <IconPlus />
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { ref, defineEmits, defineProps, onMounted } from 'vue'
import { IconPlus, Counter } from '@/components'

const props = defineProps({
  product: {
    type: Object
  },
  itemIndex: {
    type: Number
  },
  orderItemsPosition: {
    type: Object
  }
})

const emit = defineEmits(['chooseFromOrder', 'order-update'])

const isProductInOrder = ref(props.product.selected)
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

const onAddToOrder = (event, amount = 1) => {
  event && event.stopPropagation()

  const rawOrderData = window.localStorage.getItem('order')
  const selectedTables = window.localStorage.getItem('selectedTables')

  try {
    let order = null

    if (rawOrderData) {
      order = JSON.parse(rawOrderData)
      const product = order.products.find((p) => p.id === props.product.id)

      if (product) {
        product.amount = amount
      } else {
        order.products.push({ ...props.product, amount })
      }
    } else {
      order = {
        tables: [...JSON.parse(selectedTables)],
        products: [{ ...props.product, amount }]
      }
    }

    isProductInOrder.value = true
    window.localStorage.setItem('order', JSON.stringify(order))

    emit('order-update')
  } catch (error) {
    console.log('Ошибка добавления в заказа', error)
  }
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

const onProductCounterUpdate = (amount) => {
  onAddToOrder(null, amount.value)
  emit('orderCardUpdate')
}
</script>
