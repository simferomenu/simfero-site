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
    <span class="fixed bottom-[10px] left-[10px] text-[16px] text-white/30">Версия: 10.0</span>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { IconCross, IconBack, NumberCell } from '@/components'
import { useProductsStore } from '@/stores/products.store'
import { useOrderStore } from '@/stores/order.store'
import { useBusinessStore } from '@/stores/business.store'
import { propertiesToRemove, daysOfWeek, drinksGroupsId } from '@/constants/parserConfig.json'
import { productParser } from '@/composables/productParser.js'
import { stopListWorkaround } from '@/composables/stopListWorkaround.js'

const router = useRouter()
const toWaiter = () => {
  router.push('/waiter')
}

const productsStore = useProductsStore()
const menuProducts = ref(null)
const productsList = ref([])
const groupIndexRemove = ref([])
const subGroupIndexRemove = ref([])
const businessStore = useBusinessStore()
const businessLunchGroupIndex = ref(null)
const storageMenu = ref()
const isMenuLoading = ref(true)

const changeOrderFunc = () => {
  productsStore.orderFunc = !productsStore.orderFunc
}

const fillProducts = () => {
  // To sort groups that only upperCase
  // const isUpperCase = (str) => {
  //   return str === str.toUpperCase()
  // }
  //
  // menuProducts.value = storageMenu.value ? JSON.parse(storageMenu.value) : null
  // console.log(menuProducts.value)
  //
  // let productsInStopListIndexes = []
  //
  // // Add some props and clear stopList on initial parse
  // menuProducts.value.products.forEach((product,productIndex) => {
  //   propertiesToRemove.forEach((prop) => {
  //     delete product[prop]
  //   })
  //   product.isRendered = false
  //   product.amount = 0
  //   product.name = product.name.replace('ДЕЛОВЫЕ ОБЕДЫ', '').replace('ДО ', '')
  //   if (product.isInStopList) {
  //     productsInStopListIndexes.push(productIndex)
  //   }
  // })
  //
  // // Filter stop list products
  // // menuProducts.value.products = menuProducts.value.products.filter((_, index) => !productsInStopListIndexes.includes(index));
  //
  // // Set localStorage item with menu content
  // window.localStorage.setItem('menu', JSON.stringify(menuProducts.value.products))
  //
  // // Remove products with no price
  // menuProducts.value.products = menuProducts.value.products.filter(
  //   (product) => product.sizePrices[0].price.currentPrice != 0
  // )
  //
  // // mainGroup creation
  // const groups = ref(menuProducts.value.groups)
  // for (const group of groups.value) {
  //   if (group.parentGroup == null && isUpperCase(group.name) == true) {
  //     productsList.value.push(group)
  //   }
  // }
  //
  // // Create subGroups with filters and create minimal subGroup if no subGroup in groups from back got
  // for (let group of productsList.value) {
  //   subGroupIndexRemove.value = []
  //   const subGroups = menuProducts.value.groups.filter(
  //     (subGroup) => subGroup.parentGroup === group.id
  //   )
  //   if (subGroups.length !== 0) {
  //     group.subGroups = subGroups
  //   } else {
  //     group.subGroups = [
  //       {
  //         name: group.name,
  //         id: group.id,
  //         products: menuProducts.value.products
  //           .filter((subGroup) => subGroup.parentGroup === group.id)
  //           .sort((a, b) => a.order - b.order)
  //       }
  //     ]
  //   }
  //
  //   // Fill sub with products
  //   for (const [subGroupIndex, subGroup] of group.subGroups.entries()) {
  //     subGroup.name = subGroup.name.replace('ДЕЛОВЫЕ ОБЕДЫ', '').replace(' ДО', '')
  //     subGroup.isHidded = false
  //     const products = menuProducts.value.products
  //       .filter((product) => product.parentGroup === subGroup.id)
  //       .sort((a, b) => a.order - b.order)
  //     const subSubGroups = menuProducts.value.groups.filter(
  //       (subSubGroups) => subSubGroups.parentGroup === subGroup.id
  //     )
  //     // Move subSubGroups to subGroups
  //     if (subSubGroups.length !== 0) {
  //       for (let subSubGroup of subSubGroups) {
  //         subSubGroup.parentGroup = group.id
  //       }
  //       group.subGroups.push(...subSubGroups)
  //     }
  //     if (products.length !== 0) {
  //       subGroup.products = products.sort((a, b) => a.order - b.order)
  //     }
  //     if (subGroup.products == null) {
  //       subGroupIndexRemove.value.push(subGroupIndex)
  //     }
  //   }
  //   if (group.subGroups.length == 1 && group.subGroups[0].products.length == 0) {
  //     groupIndexRemove.value.push(productsList.value.indexOf(group))
  //   }
  //   group.subGroups = group.subGroups.filter(
  //     (_, index) => !subGroupIndexRemove.value.includes(index)
  //   )
  //   // Sort subGroups by order
  //   group.subGroups.sort((a, b) => a.order - b.order)
  // }
  // productsList.value = productsList.value.filter(
  //   (_, index) => !groupIndexRemove.value.includes(index)
  // )
  //
  // // Sort groups by order property
  // productsList.value.sort((a, b) => a.order - b.order)
  //
  // // Add correct weight measurements for drinks groups
  // productsList.value.forEach((group) => {
  //   if (drinksGroupsId.includes(group.id)) {
  //     group.subGroups.forEach((subGroup) => {
  //       subGroup.products.forEach((product) => {
  //         if (product.weight != 0 && product.weight != null) {
  //           if (product.weight * 1000 >= 1000) {
  //             product.weightMeasure = 'л.'
  //           } else {
  //             product.weight = product.weight * 1000
  //             product.weightMeasure = 'мл.'
  //           }
  //         }
  //       })
  //     })
  //   }
  //
  //   // Add measurement unit non-drinks
  //   if (!drinksGroupsId.includes(group.id)) {
  //     group.subGroups.forEach((subGroup) => {
  //       if (subGroup.id != 'a4411b8a-76ef-4364-afc9-11387256de9f') {
  //         subGroup.products.forEach((product) => {
  //           product.weightMeasure = 'г.'
  //           product.weight = (product.weight * 1000).toFixed(0)
  //         })
  //       } else if (subGroup.id == 'a4411b8a-76ef-4364-afc9-11387256de9f') {
  //         subGroup.products.forEach((product) => {
  //           if (product.weight != 0 && product.weight != null) {
  //             if (product.weight * 1000 >= 1000) {
  //               product.weightMeasure = 'л.'
  //             } else {
  //               product.weight = product.weight * 1000
  //               product.weightMeasure = 'мл.'
  //             }
  //           }
  //         })
  //       }
  //     })
  //   }
  // })
  //
  // // Get businessProducts group
  //
  // businessLunchGroupIndex.value = productsList.value
  //   .map((e) => e.id)
  //   .indexOf('d9b01578-bd7f-4934-bf6e-2806900c3e1f')
  // businessStore.businessProducts = productsList.value[businessLunchGroupIndex.value]
  //
  // // Sort products in businessProducts by day
  // for (const subGroup of businessStore.businessProducts.subGroups) {
  //   subGroup.daysOfWeek = []
  //   for (let i = 0; i < daysOfWeek.length; i++) {
  //     subGroup.daysOfWeek.push(
  //       subGroup.products
  //         .filter((product) => product.additionalInfo != null)
  //         .filter((product) => product.additionalInfo.includes(daysOfWeek[i]))
  //     )
  //     const filterNoDay = subGroup.products
  //       .filter((product) => product.additionalInfo == null)
  //       .filter((product) => product.name != null)
  //     if (filterNoDay.length != 0) {
  //       subGroup.daysOfWeek[i].push(...filterNoDay)
  //     }
  //   }
  // }
  // // reset businessOrder
  // businessStore.businessOrder = []
  // businessStore.finalCost = 0
  //
  // // Add in business subGroups and products for easier functonality implem in future
  // businessStore.businessProducts.subGroups.forEach((subGroup, subGroupIndex) => {
  //   subGroup.products.forEach((product, productIndex) => {
  //     product.subGroupIndex = subGroupIndex
  //     product.productIndex = productIndex
  //   })
  // })
  //
  // // Copy products in businessProducts to days
  // businessStore.businessProducts.subGroups.forEach((subGroup) => {
  //   subGroup.daysOfWeek.forEach((day, dayIndex) => {
  //     day.forEach((product, productIndex) => {
  //       product.dayIndex = dayIndex
  //       product.productIndex = productIndex
  //     })
  //   })
  // })
  //
  // // Remove businessProducts from common products base
  // productsList.value.splice(businessLunchGroupIndex.value, 1)
  //
  // // Remove Additional groups from productsList
  // for (const group of productsList.value) {
  //   group.subGroups = group.subGroups.filter((subGroup) => !subGroup.name.includes('ДОПЫ'))
  // }
  //
  // productsStore.productsList = productsList.value
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
  window.location = '/'
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
