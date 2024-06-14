<template>
  <div
    class="fixed top-0 left-0 flex flex-col justify-between h-screen w-screen bg-darkBlue order-bg pt-[35px] overflow-auto pointer-events-none pb-[140px] z-[3]"
  >
    <IconCross @click="$emit('closeOrder')" />
    <IconBack @click="$emit('closeOrder')" />
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
        @chooseFromOrder="onChooseFromOrder"
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
        <span
          @click="onMakeOrder"
          class="font-Segoe font-semibold text-[20px] tracking-[0.13em] uppercase text-gold"
        >
          Пригласить официанта
        </span>
        <div class="absolute bottom-[-10px] right-[-200px] w-[600px] flex shrink-1 items-center">
          <img class="block h-[15px] w-auto" src="/icons/IconRhombusGold.svg" alt="" />
          <div class="h-[1px] w-full bg-gold"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, defineEmits } from 'vue';
import axios from 'axios';

import { IconCross, IconBack, OrderCard } from '@/components'
import { useOrderStore } from '@/stores/order.store'

const orderStore = useOrderStore();

const emit = defineEmits(['updateOrder'])

const onChooseFromOrder = () => {
  // emit('chooseFromOrder', props.product)
}

const orderItems = ref([])
const totalPrice = ref(0)
const order = ref(null)

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

const onOrderUpdate = () => {
  calcTotalPrice()
  emit('updateOrder')
}

const onMakeOrder = async () => {
  try {
    const rawOrderData = JSON.parse(window.localStorage.getItem('order'));

    const resp = await axios.post('/order', {
      table: rawOrderData.tables[0],
      items: rawOrderData.products.map((item) => ({
        productId: item.id,
        price: item.sizePrices[0].price.currentPrice,
        type: 'Product',
        amount: item.amount
      })),
    });

    if (resp.data) {
      alert('Заказ успешно направлен официанту')
    }
  } catch(error) {
    console.log('Ошибка получения заказа', error);
  }

  /*
  {
    "table": "1c34b882-4261-4364-8339-d8459ad8bf16",
    "items": [{
        "productId": "045815e9-7577-46e5-aacd-4a5793d82791",
        "price": 3250,
        "type": "Product",
        "amount": 1
    }]
  }
*/
}

onMounted(() => {
  getOrderData()
  calcTotalPrice()
})
</script>

<style scoped></style>
