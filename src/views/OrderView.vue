<template>
  <IconCross @click="toMain" />
  <IconBack @click="toMain" />
  <!-- <DishScreen
    :class="
      !isDishVisible
        ? 'default-transition hidden-screen animated-out'
        : 'default-transition visible-screen animated'
    "
    :product="selectedProduct"
    @closeDish="isDishVisible = false"
  /> -->
  <div
    class="relative w-screen min-h-screen box-border bg-darkBlue order-bg flex flex-col pt-[35px] overflow-hidden pointer-events-none pb-[140px]"
  >
    <div
      class="font-Sitka w-full flex justify-center items-center text-[36px] font-base leading-[186%] tracking-[0.11em] uppercase text-[#fff] mb-[55px] animated-down"
    >
      Мой заказ
    </div>
    <div
      class="w-full flex flex-wrap box-border pl-[60px] pr-[20px] flex-1 !pointer-events-auto mb-[40px]"
    >
      <OrderCard
        v-for="item in orderItems"
        :product="item"
        :key="item.id"
        @order-update="onOrderUpdate"
      />
    </div>
    <div
      class="fixed bottom-0 w-full flex justify-between items-center border-solid border-t-[1px] border-t-[#fff] min-h-[60px] box-border px-[80px] pt-[15px] mt-[15px] mb-[55px] z-[4] animated-up"
    >
      <div class="absolute top-[-100px] left-0 order-fade w-full h-[275px] z-[-1]"></div>
      <div class="flex items-center">
        <span class="font-Segoe font-[350] text-[26px] tracking-[0.03em] text-[#fff]"
          >Сумма заказа:</span
        >
        <span class="font-Segoe font-bold text-[26px] tracking-[0.03em] text-[#fff] ml-[30px]"
          >{{ totalPrice }} Руб.</span
        >
      </div>
      <div class="flex flex-col h-full !pointer-events-auto">
        <span class="font-Segoe font-semibold text-[20px] tracking-[0.13em] uppercase text-gold"
          >Пригласить официанта</span
        >
        <div class="absolute bottom-[-10px] right-[-200px] w-[600px] flex shrink-1 items-center">
          <img class="block h-[15px] w-auto" src="/icons/IconRhombusGold.svg" alt="" />
          <div class="h-[1px] w-full bg-gold"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { IconCross, IconBack, OrderCard } from '@/components'

const router = useRouter()
const orderItems = ref([])
const totalPrice = ref(0)
const order = ref(null)

const toMain = () => router.push('/')

const getOrderData = () => {
  const rawOrderData = window.localStorage.getItem('order')

  try {
    if (rawOrderData) {
      order.value = JSON.parse(rawOrderData)
      orderItems.value = order.value.products
      return order.value
    }
  } catch (error) {
    console.log('Ошибка получение состояния корзины', error)
  }
}

const calcTotalPrice = () => {
  const items = getOrderData().products
  totalPrice.value = items.reduce((acc, item) => {
    return acc + item.amount * item.sizePrices[0].price.currentPrice
  }, 0)
}

const onOrderUpdate = () => calcTotalPrice()

onMounted(() => {
  getOrderData()
  calcTotalPrice()
})
</script>
