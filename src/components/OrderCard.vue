<template>
  <div
    class="relative flex flex-col h-[350px] w-[calc(50%-40px)] xs:w-[calc(33%-40px)] md:w-[calc(25%-40px)] box-border rounded-[19px] order-card-bg shrink-0 pointer-events-auto default-transition mb-[40px] mr-[40px] animated-up"
    :class="{ 'active-menu-card border-animation': false }"
  >
    <div class="menu-card-border"></div>
    <div class="relative h-[145px] w-full shrink-0">
      <div
        class="absolute w-[183px] h-auto top-[-30px] left-[-25px] overflow-hidden rounded-[100px]"
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
        {{ product.description }}
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
import { ref, defineEmits, onMounted } from 'vue'
import { IconPlus, Counter } from '@/components'

const props = defineProps({
  product: {
    type: Object
  }
})

const emit = defineEmits(['choose', 'order-update'])

const isDescrHidden = ref(false)
const productName = ref(null)

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
        order.products.push({ id: props.product.id, amount })
      }
    } else {
      order = {
        tables: [...JSON.parse(selectedTables)],
        products: [{ id: props.product.id, amount }]
      }
    }
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
    window.localStorage.setItem('order', JSON.stringify(order))
    emit('order-update')
  } catch (error) {
    console.log('Ошибка удаления из заказа', error)
  }
}

const onProductCounterUpdate = (amount) => {
  onAddToOrder(null, amount.value)
}
</script>
