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
      v-if="isFetchingTables"
      class="absolute left-1/2 translate-x-[-50%] w-[150px] h-[150px] loader-top-position"
    >
      <img src="/icons/loading.gif" alt="" />
    </div>

    <div
      class="flex relative w-full h-[100%] mt-[40px] box-border pl-[40px] overflow-hidden animated-up"
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
            :is-selected="isSelected(item)"
            v-for="item in zone.tables"
            @selected="onCellSelected"
          />
        </div>
      </div>
    </div>

    <div
      class="w-full relative flex justify-between box-border px-[40px] mt-[40px] mb-[30px] shrink-0 h-fit"
    >
      <div class="flex flex-col w-[320px]">
        <!--        <span class="font-Segoe font-semibold text-[20px] tracking-[0.13em] uppercase text-gold"-->
        <!--          >10 стол, основной зал</span-->
        <!--        >-->
        <!--        <div class="flex justify-between items-center mt-[12px]">-->
        <!--          <span class="font-Segoe font-[350] text-[14px] tracking-[0.05em] text-[#fff]"-->
        <!--            >3000 рублей депозит</span-->
        <!--          >-->
        <!--          <span class="font-Segoe font-[350] text-[14px] tracking-[0.05em] text-[#fff]"-->
        <!--            >Бронь стола на 11:00</span-->
        <!--          >-->
        <!--        </div>-->
      </div>
      <div class="relative flex flex-col h-full w-[310px]">
        <span
          class="font-Segoe font-semibold text-[20px] tracking-[0.13em] uppercase text-gold cursor-pointer !pointer-events-auto"
          @click="onTablesSelected"
        >
          Выбрать
        </span>
        <div class="absolute bottom-[-20px] right-[-285px] w-[600px] flex shrink-1 items-center">
          <img class="block h-[15px] w-auto" src="/icons/IconRhombusGold.svg" alt="" />
          <div class="h-[1px] w-full bg-gold"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { IconCross, IconBack, NumberCell } from '@/components'
import { useProductsStore } from '@/stores/products.store';
import { useOrderStore } from '@/stores/order.store';
import { useBusinessStore } from '@/stores/business.store';

const router = useRouter()
const toWaiter = () => {
  router.push('/waiter')
}

const productsStore = useProductsStore()
const menuData = ref(null)
const productsList = ref([])
const groupIndexRemove = ref([])
const subGroupIndexRemove = ref([])
const businessStore = useBusinessStore()

const isUpperCase = (str) => {
  return str === str.toUpperCase()
}

const storageMenuExp = window.localStorage.getItem('menu')
menuData.value = storageMenuExp ? JSON.parse(storageMenuExp) : null
menuData.value.products.forEach(function (product) {
  product.isRendered = false
  product.amount = 0
})
const filteredProducts = menuData.value.products
  .filter((product) => product.type === 'Dish' || product.type === 'Good')
  .filter((product) => !product.isDeleted)
  .filter((product) => product.sizePrices[0].price.currentPrice!=0)
productsStore.productsListFull = filteredProducts
menuData.value.products = filteredProducts
const groups = ref(menuData.value.groups)
for (const group of groups.value) {
  if (group.parentGroup == null && isUpperCase(group.name) == true) {
    productsList.value.push(group)
  }
}

for (let group of productsList.value) {
  subGroupIndexRemove.value = []
  const subGroups = menuData.value.groups.filter((subGroup) => subGroup.parentGroup === group.id)
  if (subGroups.length != 0) {
    group.subGroups = subGroups
  } else {
    group.subGroups = [
      {
        name: group.name,
        products: menuData.value.products.filter((subGroup) => subGroup.parentGroup === group.id)
      }
    ]
  }
  // Fill sub with products
  for (const [subGroupIndex, subGroup] of group.subGroups.entries()) {
    const products = menuData.value.products.filter(
      (product) => product.parentGroup === subGroup.id
    )
    const subSubGroups = menuData.value.groups.filter(
      (subSubGroups) => subSubGroups.parentGroup === subGroup.id
    )
    if (subSubGroups.length !== 0) {
      group.subGroups.push(...subSubGroups)
    }
    if (products.length !== 0) {
      subGroup.products = products
    }
    if (subGroup.products == null) {
      subGroupIndexRemove.value.push(subGroupIndex)
    }
  }
  if (group.subGroups.length == 1 && group.subGroups[0].products.length == 0) {
    groupIndexRemove.value.push(productsList.value.indexOf(group))
  }
  group.subGroups = group.subGroups.filter((_, index) => !subGroupIndexRemove.value.includes(index))
  group.subGroups.sort((a, b) => a.order - b.order)
}
productsList.value = productsList.value.filter(
  (_, index) => !groupIndexRemove.value.includes(index)
)

productsList.value.sort((a, b) => a.order - b.order)
// console.log(productsList)

productsStore.setProductsList(productsList.value)

const orderStore = useOrderStore()
orderStore.order = []
orderStore.orderInfo.orderAmount = 0
orderStore.tables = []
orderStore.products = []


const selectedTables = ref([])
const zones = ref([])
const isFetchingTables = ref(true)

const onCellSelected = ({ id }) => {
  const isExist = selectedTables.value.find((item) => item === id)

  if (!isExist) {
    selectedTables.value.push(id)
  } else {
    selectedTables.value = selectedTables.value.filter((item) => item != id)
  }

  window.localStorage.setItem('selectedTables', JSON.stringify(selectedTables.value))
}

const isSelected = ({ id }) => {
  return Boolean(selectedTables.value.find((item) => item === id))
}

const onTablesSelected = () => {
  window.location = '/'
}

onMounted(() => {
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
