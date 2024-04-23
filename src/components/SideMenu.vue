<template>
  <div
    class="relative w-[312px] !h-screen bg-darkBlue flex flex-col box-border py-[30px] px-[28px] shrink-0 border-r-gold border-solid border-r-[2px] default-transition pointer-events-none overflow-hidden"
  >
    <div class="relative w-full flex items-center h-[71px] animated-down">
      <img class="h-full w-auto" src="/icons/IconLogo.png" alt="" />
      <div class="relative flex flex-col ml-[15px]">
        <h1
          class="font-Sitka font-normal text-[36px] leading-[96%] tracking-[0.09em] uppercase text-gold pointer-events-auto"
          @click="toWaiterView"
        >
          SIMFERO
        </h1>
        <span class="font-Sitka font-normal text-[14px] text-gold tracking-[0.07em]"
          >панорамный ресторан</span
        >
      </div>
    </div>
    <div
      class="relative w-full flex-1 h-full flex flex-col mt-[90px] !overflow-auto pointer-events-auto custom-scrollbar animated-up"
    >
      <ul class="[&>*:not(:last-child)]:mb-[27px] box-border pb-[20px]">
        <li v-for="item in categories" :key="item.name">
          <a
            :class="[
              'menu-link',
              {
                active: item.id === activeItem.id
              }
            ]"
            @click="onCategorySelect(item)"
          >
            {{ item.name }}
          </a>
        </li>
      </ul>
    </div>
    <div
      class="relative w-full flex flex-col mb-[50px] pt-[50px] [&>*:not(:last-child)]:mb-[30px] animated-up"
    >
      <div class="absolute left-0 top-0 w-[312px] translate-x-[-28px] h-[150%] bg-[#27282b]"></div>
      <!-- <div class="relative flex items-center !pointer-events-auto">
        <img class="w-[32px] h-[32px]" src="/icons/IconExclamation.svg" alt="" />
        <span class="menu-link ml-[15px]">Интерактивы</span>
      </div> -->
      <div class="relative flex items-center ml-[50px]">
        <span @click="toOrderView" class="menu-link !pointer-events-auto shrink-0">Мой заказ</span>
        <SmallCounter v-if="orderAmount" :value="orderAmount" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { ref, watch, defineEmits, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { SmallCounter } from '@/components'

const props = defineProps({
  categories: {
    type: Array
  },
  orderCount: {
    type: Number,
  }
})

const emit = defineEmits(['select, scroll'])
const router = useRouter()
const activeItem = ref([])
const orderAmount = ref(0);

watch(() => props.categories, (data) => {
  activeItem.value = data[0];
});

watch(() => props.orderCount, (data) => {
  orderAmount.value = data;
});

const onCategorySelect = (item) => {
  activeItem.value = item
  emit('select', { item })
}
const toOrderView = () => {
  router.push('/order')
}

const toWaiterView = () => {
  window.localStorage.removeItem('selectedTables')
  router.push('/waiter')
}

onMounted(() => {
  const rawOrderData = window.localStorage.getItem('order');

  try {
    if (rawOrderData) {
      const order = JSON.parse(rawOrderData);
      orderAmount.value = order.products.reduce((accumulator, item) => accumulator + item.amount, 0);
    }
  } catch (error) {
    console.log('Ошибка получение состояния корзины', error)
  }
});
</script>
