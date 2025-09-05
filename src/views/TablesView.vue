<template>
  <IconCross @click="toWaiter" />
  <IconBack @click="toWaiter" />
  <div
    class="relative w-screen h-screen box-border waiter-bg flex flex-col py-[35px] !overflow-hidden pointer-events-none"
  >
    <div
      class="relative flex w-full h-fit box-border justify-center items-center mt-[50px] shrink-0 animated"
    >
      <div class="font-Sitka text-[36px] tracking-[0.11em] uppercase font-[400] text-[#fff]">
        Выберите столик для гостей
      </div>
      <div class="relative box-border flex items-center"></div>
    </div>

    <div
      v-if="isMenuLoading"
      class="absolute left-1/2 translate-x-[-50%] w-[150px] h-[150px] loader-top-position"
    >
      <img src="/icons/loading.gif" alt="" />
    </div>

    <div
      class="flex relative w-full h-[100%] mt-[40px] box-border pl-[40px] overflow-hidden animated-up"
      v-if="!isFetchingTables && !isMenuLoading"
    >
      <div
        class="relative w-1/2 shrink-0 h-full flex flex-col mr-[20px]"
        v-for="zone in zones"
        :key="zone.name"
      >
        <div class="relative flex w-full mb-[40px]">
          <span
            class="font-semibold text-[#fff] uppercase text-[25px] leading-[117%] tracking-[0.11em] font-Sitka mr-[14px] block shrink-0 w-fit"
          >
            {{ zone.name }}
          </span>
          <div class="relative w-full flex shrink-1 items-center">
            <img class="block h-[15px] w-auto" src="/icons/IconRhombusWhite.svg" alt="" />
            <div class="h-[1px] w-full bg-[#fff]"></div>
          </div>
        </div>
        <div class="relative w-full flex flex-wrap overflow-auto !pointer-events-auto">
          <number-cell
            :key="item.id"
            :value="item.number"
            :id="item.id"
            :is-selected="item.id === selectedTables[0]"
            v-for="item in zone.tables"
            @selected="onCellSelected"
          />
        </div>
      </div>
    </div>

    <div
      class="w-full relative flex justify-between box-border px-[40px] mt-[40px] mb-[30px] shrink-0 h-fit"
      v-if="!isFetchingTables && !isMenuLoading"
    >
      <div class="flex items-center w-[320px] pointer-events-auto" @click="changeOrderFunc">
        <label
          class="font-Segoe font-semibold text-[20px] tracking-[0.13em] uppercase text-gold cursor-pointer mr-[10px]"
        >
          Отображение заказов</label
        >
        <input type="checkbox" :checked="productsStore.orderFunc" />
      </div>
      <div class="absolute right-[50%] translate-x-[50%]">
        <span
          v-if="selectedTables.length != 0"
          class="font-Segoe font-semibold text-[20px] tracking-[0.13em] uppercase text-gold cursor-pointer !pointer-events-auto"
          @click="onOrderDelete"
        >
          Удалить заказ
        </span>
      </div>
      <div
        class="flex flex-col w-fit shrink-0 border-solid border-b-[1px] border-b-darkGold px-[10%] mb-[-10px] translate-x-[60px] default-transition"
      >
        <span
          class="absolute font-Segoe font-semibold text-[20px] tracking-[0.13em] uppercase left-[10px] text-gold cursor-pointer !pointer-events-auto bottom-[7.5px]"
          @click="onTablesSelected"
        >
          Выбрать
        </span>
        <img
          class="absolute h-[15px] w-auto left-[-12px] bottom-[-7.5px]"
          src="/icons/IconRhombusGold.svg"
          alt=""
        />
      </div>
    </div>
    <span class="fixed bottom-[10px] left-[10px] text-[16px] text-white/30"
      >Версия: {{ version }}</span
    >
  </div>

  <PromotionScreen v-if="isPromotionVisible" @close="closePromotion" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { IconCross, IconBack, NumberCell, PromotionScreen } from '@/components'
import { useProductsStore } from '@/stores/products.store'
import { useOrderStore } from '@/stores/order.store'
import { useBusinessStore } from '@/stores/business.store'

import { productParser } from '@/composables/productParser.js'

const version = import.meta.env.VITE_APP_VERSION

const router = useRouter()
const toWaiter = () => {
  router.push('/waiter')
}

const productsStore = useProductsStore()
const isPromotionVisible = ref(false)
const menuProducts = ref(null)
const businessStore = useBusinessStore()
const storageMenu = ref()
const isMenuLoading = ref(true)

const changeOrderFunc = () => {
  productsStore.orderFunc = !productsStore.orderFunc
}

const closePromotion = () => {
  isPromotionVisible.value = false
  window.location = '/'
}

const fillProducts = () => {
  menuProducts.value = storageMenu.value ? JSON.parse(storageMenu.value) : null
  let parsedProduct = productParser(menuProducts.value)
  businessStore.businessOrder = []
  businessStore.finalCost = 0
  businessStore.businessProducts = parsedProduct.businessProducts
  productsStore.productsList = parsedProduct.products
  isMenuLoading.value = false
}

const orderStore = useOrderStore()
orderStore.order = []
orderStore.orderInfo.prevOrderAmount = 0
orderStore.orderInfo.orderAmount = 0
orderStore.tables = []
orderStore.products = []

const selectedTables = ref([])
const zones = ref([])
const isFetchingTables = ref(true)
const onCellSelected = ({ id }) => {
  selectedTables.value = [id]
  // const isExist = selectedTables.value.find((item) => item === id)
  //
  // if (!isExist) {
  //   selectedTables.value.push(id)
  // } else {
  //   selectedTables.value = selectedTables.value.filter((item) => item != id)
  // }

  window.localStorage.setItem('selectedTables', JSON.stringify(selectedTables.value))
}

const isSelected = ({ id }) => {
  return Boolean(selectedTables.value.find((item) => item === id))
}

const onTablesSelected = () => {
  isPromotionVisible.value = true
}

const onOrderDelete = async () => {
  if (window.confirm('Вы уверены?')) {
    for (let i = 0; i < selectedTables.value.length; i++) {
      await axios
        .delete('/order', { params: { tableId: selectedTables.value[i] } })
        .then((response) => {
          alert('Заказ удалён')
        })
    }
  }
}

onMounted(() => {
  axios.get('/menu').then((menuResponse) => {
    storageMenu.value = JSON.stringify(menuResponse.data)
    fillProducts()
  })
  axios.get('/tables').then((response) => {
    zones.value = response.data
    selectedTables.value = JSON.parse(window.localStorage.getItem('selectedTables')) || []
    isFetchingTables.value = false
  })
})
</script>

<style scoped>
.loader-top-position {
  top: calc(50% - 75px);
}
</style>
