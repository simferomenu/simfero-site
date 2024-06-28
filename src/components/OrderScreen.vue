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
        v-for="(item, itemIndex) in orderItems"
        :product="item"
        :key="item.id"
        :index="itemIndex"
        :orderItemsPosition=orderItemsPosition[itemIndex]
        @chooseFromOrder="onChooseFromOrder"
        @order-update="onOrderUpdate"
      />
    </div>
    <div
      class="fixed bottom-0 w-full flex justify-between items-center border-solid border-t-[1px] border-t-[#fff] min-h-[60px] box-border px-[60px] pt-[15px] mt-[15px] mb-[55px] z-[4] animated-up"
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

      <!-- Кнопки -->
      <div
        v-if="isAdditionalItems"
        :class="['relative flex flex-col h-full !pointer-events-auto', {
          'opacity-[0.3]': isOrderUpdating
        }]"
      >
        <img v-if="isOrderUpdating" src="/icons/loading.gif" class="absolute top-0 left-[-40px] w-[40px]"/>

        <span
          @click="onUpdateOrder"
          class="font-Segoe font-semibold text-[20px] tracking-[0.13em] uppercase text-gold"
        >
          Добавить в заказ
        </span>

        <div class="absolute bottom-[-10px] right-[-200px] w-[600px] flex shrink-1 items-center">
          <img class="block h-[15px] w-auto" src="/icons/IconRhombusGold.svg" alt="" />
          <div class="h-[1px] w-full bg-gold"></div>
        </div>
      </div>

      <div
        v-else
        :class="['relative flex flex-col h-full !pointer-events-auto', {
          'opacity-[0.3]': !orderStore.preOrder.length || isOrderInProgress || isOrderCreating
        }]"
      >
        <img v-if="isOrderCreating" src="/icons/loading.gif" class="absolute top-0 left-[-40px] w-[40px]"/>

        <span
          @click="onMakeOrder"
          class="font-Segoe font-semibold text-[20px] tracking-[0.13em] uppercase text-gold"
        >
          {{ !isOrderInProgress ? 'Пригласить официанта' : 'Скоро начнём готовить' }}
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
import { onMounted, ref, computed } from 'vue';
import axios from 'axios';

import { IconCross, IconBack, OrderCard } from '@/components'
import { useOrderStore } from '@/stores/order.store'
import { useProductsStore } from '@/stores/products.store';

const emit = defineEmits(['updateOrder'])

const onChooseFromOrder = () => {}

const orderItems = ref([])
const orderItemsPosition = ref([])
const orderStore = useOrderStore()
const productsStore = useProductsStore()
const isOrderCreating = ref(false);
const isOrderUpdating = ref(false);
const isOrderInProgress = ref(Boolean(orderStore.orderInfo.orderId));
const isAdditionalItems = ref(false);


orderStore.$subscribe(async (_, { orderInfo }) => {
  getOrderData();

  isOrderInProgress.value = Boolean(orderInfo.orderId);

  if (orderInfo.orderId) {
    isOrderCreating.value = false;
  }

  if (orderInfo.orderAmount === 0) {
    isOrderUpdating.value = false;
  }
});

const getOrderData = () => {
  const orderedItems = orderStore.order.map((order) => ({ ...order, isOrdered: true }));

  orderItems.value = [...orderedItems, ...orderStore.preOrder];

  for (const item of orderItems.value) {
    for (const group of productsStore.productsList) {
      const groupIndex = productsStore.productsList.indexOf(group)
      for (const subGroup of group.subGroups) {
        const subGroupIndex = group.subGroups.indexOf(subGroup)
        const index = subGroup.products.map(e=>e.id).indexOf(item.id)
        if (index!=-1) {
          orderItemsPosition.value.push({cardIndex: index, groupIndex: groupIndex, subGroupIndex:subGroupIndex})
        }
      }
    }
  }

  if (orderedItems.length && orderStore.preOrder.length) {
    isAdditionalItems.value = true;
  } else {
    isAdditionalItems.value = false;
  }
}

const totalPrice = computed(() => {
  let final = 0;

  final += orderStore.order.reduce((acc, item) => (acc + (item.amount * item.sizePrices[0].price.currentPrice)), 0);
  final += orderStore.preOrder.reduce((acc, item) => (acc + (item.amount * item.sizePrices[0].price.currentPrice)), 0);

  return final
})

const onOrderUpdate = () => {
  emit('updateOrder')
}

const onMakeOrder = async () => {
  try {
    if (!orderStore.preOrder.length || isOrderInProgress.value || isOrderCreating.value) {
      return;
    }

    isOrderCreating.value = true;

    const tables = JSON.parse(window.localStorage.getItem('selectedTables'));

    await axios.post('/order', {
      table: tables[0],
      items: orderStore.preOrder.map((item) => ({
        productId: item.id,
        price: item.sizePrices[0].price.currentPrice,
        type: 'Product',
        amount: item.amount
      })),
    });
  } catch(error) {
    console.log('Ошибка получения заказа', error);
  }
}

const onUpdateOrder = async () => {
  try {
    isOrderUpdating.value = true;

    await axios.put('/order', {
      order: orderStore.orderInfo.orderId,
      items: orderStore.preOrder.map((item) => ({
        productId: item.id,
        price: item.sizePrices[0].price.currentPrice,
        type: 'Product',
        amount: item.amount
      })),
    });
  } catch(error) {
    console.log('Ошибка получения заказа', error);
  }
}

onMounted(() => {
  getOrderData()
})
</script>

<style scoped></style>
