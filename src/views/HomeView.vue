<template>
  <div class="relative flex w-screen h-screen pointer-events-none">
    <Transition name="fade">
      <SearchScreen
        :class="!isSearchVisible ? 'pointer-events-none' : 'pointer-events-auto'"
        v-if="isSearchVisible"
        @closeSearch="isSearchVisible = false"
        @choose="toggleDish"
      />
    </Transition>
    <Transition name="fade">
      <DishScreen
        :class="!isDishVisible ? 'pointer-events-none' : 'pointer-events-auto'"
        v-if="isDishVisible"
        :product="selectedProduct"
        @closeDish="isDishVisible = false"
      />
    </Transition>
    <Transition name="fade">
      <OrderScreen
        :class="!isOrderVisible ? 'pointer-events-none' : 'pointer-events-auto'"
        v-if="isOrderVisible"
        :product="product"
        @closeOrder="isOrderVisible = false"
        @chooseFromOrder="toggleDish"
        @updateOrder="onOrderUpdate"
      />
    </Transition>

    <SideMenu
      :categories="productsStore.productsList"
      @selectGroup="onGroupSelect"
      @selectSubGroup="onSubGroupSelect"
      :order-count="menuOrderCount"
      @openOrder="isOrderVisible = true"
    />
    <div
      class="relative flex flex-col shrink-1 w-full h-screen overflow-auto box-border main-bg pb-[40px] pl-[37px] pointer-events-auto"
      ref="scrollBody"
      v-if="!businessStore.isBusinessVisible"
    >
      <div
        class="fixed top-[15px] right-[15px] h-[40px] w-[40px] z-[2]"
        @click="isSearchVisible = true"
      >
        <img class="w-full h-full" src="/icons/IconInputLogo.svg" alt="" />
      </div>
      <div
        v-if="isLoading"
        class="fixed top-[35vh] w-[200px] h-[200px] z-[3] pointer-events-none right-[calc(50vw-200px)]"
      >
        <img src="/icons/loadingBlack.gif" alt="" />
      </div>
      <div ref="scrollElement" class="[&>*]:pt-[40px]">
        <MenuSection
          v-for="(item, subGroupIndex) in productsStore.productsList[displayedGroupIndex].subGroups"
          ref="scrollSection"
          :name="item.name"
          :key="item.name"
          :id="subGroupIndex"
          :groupIndex="displayedGroupIndex"
          :data-id="subGroupIndex"
          :data-sub-group-index="subGroupIndex"
        >
          <MenuCard
            v-for="(product, cardIndex) in item.products"
            :product="product"
            :key="product.id"
            :groupIndex="displayedGroupIndex"
            :subGroupIndex="subGroupIndex"
            :data-id="cardIndex"
            :cardIndex="cardIndex"
            @choose="toggleDish"
            @order-update="onOrderUpdate"
          />
        </MenuSection>
        <!-- <MenuSection
          v-for="(item, sectionIndex) in productsStore.productsList[0]"
          :name="item.name"
          :key="item.name"
        >
          <MenuCard
            v-for="(product, index) in bufferArr[sectionIndex].products"
            :product="product"
            :key="product.id"
            :data-id="index + 1"
            :renderedCount="renderedCount"
            :productsLength="bufferArr[sectionIndex].products.length"
            :sectionIndex="sectionIndex"
            @choose="toggleDish"
            @order-update="onOrderUpdate"
            @expand="onBufferArrExpand"
          />
        </MenuSection> -->
      </div>
    </div>
    <BusinessLunchScreen v-if="businessStore.isBusinessVisible" @choose="toggleDish" />
  </div>
</template>

<style scoped></style>

<script setup>
// import axios from 'axios'
import { ref } from 'vue'
import { useProductsStore } from '@/stores/products.store'
import { useBusinessStore } from '@/stores/business.store'

import {
  SideMenu,
  MenuSection,
  MenuCard,
  DishScreen,
  OrderScreen,
  BusinessLunchScreen,
  SearchScreen
} from '@/components'

const productsStore = useProductsStore()
const businessStore = useBusinessStore()

// const menuData = ref(null)
// const menu = ref([])
// const categories = ref([])
const selectedCategory = ref(null)
const isLoading = ref(false)
const selectedProduct = ref(null)
const menuOrderCount = ref(null)
const displayedGroupIndex = ref(0)
const scrollElement = ref(null)
const scrollSection = ref(null)
// const selectedSubGroupIndex = ref(null)
const scrollBody = ref(null)

const onSubGroupSelect = ({ selectedSubGroupIndex }) => {
  for (let i = 2; i < selectedSubGroupIndex + 1; i++) {
    if (
      productsStore.productsList[displayedGroupIndex.value].subGroups[i].products[0].isRendered !=
      true
    ) {
      for (const product of productsStore.productsList[displayedGroupIndex.value].subGroups[i]
        .products) {
        product.isRendered = true
      }
    }
  }
  scrollToSubGroup(selectedSubGroupIndex)
  setTimeout(() => {
    scrollToSubGroup(selectedSubGroupIndex)
  }, 50)
  // const element = document.getElementById(selectedSubGroupIndex)
  // const yOffset = -40
  // const y = element.getBoundingClientRect().top + window.scrollY + yOffset
  // scrollBody.value.scrollTo({ top: y })
  // if (
  //   productsStore.productsList[displayedGroupIndex.value].subGroups.length > 1 &&
  //   productsStore.productsList[displayedGroupIndex.value].subGroups[selectedSubGroupIndex].products
  //     .length >
  //     cardsPerLine.value * 4
  // ) {
  //   for (let i = 0; i < cardsPerLine.value * 4; i++) {
  //     productsStore.productsList[displayedGroupIndex.value].subGroups[
  //       selectedSubGroupIndex
  //     ].products[i].isRendered = true
  //   }
  // } else {
  //   for (
  //     let i = 0;
  //     i <
  //     productsStore.productsList[displayedGroupIndex.value].subGroups[selectedSubGroupIndex]
  //       .products.length;
  //     i++
  //   ) {
  //     productsStore.productsList[displayedGroupIndex.value].subGroups[
  //       selectedSubGroupIndex
  //     ].products[i].isRendered = true
  //   }
  // }
  // if (productsStore.productsList[displayedGroupIndex].subGroups.length > 1) {
  // for ( let i=0; i<cardsPerLine.value*4; i++) {
  //   productsStore.productsList[displayedGroupIndex].subGroups[1].products[i].isRendered=true
  // }
  // }

  if (
    productsStore.productsList[displayedGroupIndex.value].subGroups[selectedSubGroupIndex]
      .products[0].isRendered == false
  ) {
    for (const product of productsStore.productsList[displayedGroupIndex.value].subGroups[
      selectedSubGroupIndex
    ].products) {
      product.isRendered = true
    }
  }
}

const onGroupSelect = ({ selectedGroupIndex }) => {
  displayedGroupIndex.value = selectedGroupIndex
  selectedCategory.value = selectedGroupIndex
  productsStore.productsList[selectedGroupIndex].subGroups[0].products.forEach((product) => {
    product.isRendered = true
  })
  setTimeout(() => {
    scrollBody.value.scrollTo({ top: 0, behavior: 'smooth' })
  })
  // if (productsStore.productsList[selectedGroupIndex].subGroups.length == 1) {
  //   for (
  //     let i = 0;
  //     i < productsStore.productsList[selectedGroupIndex].subGroups[0].products.length;
  //     i++
  //   ) {
  //     productsStore.productsList[selectedGroupIndex].subGroups[0].products[i].isRendered = true
  //   }
  // } else {
  //   for (let i = 0; i < cardsPerLine.value * 4; i++) {
  //     productsStore.productsList[selectedGroupIndex].subGroups[0].products[i].isRendered = true
  //   }
  // }
  // setTimeout(() => {
  //   // scrollBody.value.scrollTo({ top: 0 })
  //   scrollBody.value.scrollTo({ top: 0 })
  //   scrollBody.value.scrollBy({ top: 0, behavior: 'smooth' })
  // }, 10)
  // scrollBody.value.scrollBy(0, -40)
}

const scrollToSubGroup = (subGroupIndex) => {
  const targetElement = scrollBody.value.querySelector(`[data-sub-group-index="${subGroupIndex}"]`)
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth' })
  } else {
    console.log(`"Элемент с индексом - " ${subGroupIndex} Не найден.`)
  }
}

// const storageMenuExp = window.localStorage.getItem('menu')
// expMenuData.value = storageMenuExp ? JSON.parse(storageMenuExp) : null
// expMenuData.value.products.forEach(function (product) {
//   product.isRendered = false
//   product.amount = 0
// })
// const filteredProducts = expMenuData.value.products
//   .filter((product) => product.type === 'Dish' || product.type === 'Good')
//   .filter((product) => !product.isDeleted)
// expMenuData.value.products = filteredProducts
// const groups = ref(expMenuData.value.groups)
// for (const group of groups.value) {
//   if (group.parentGroup == null && isUpperCase(group.name) == true) {
//     productsListExp.value.push(group)
//   }
// }

// for (let group of productsListExp.value) {
//   subGroupIndexRemove.value = []
//   const subGroups = expMenuData.value.groups.filter((subGroup) => subGroup.parentGroup === group.id)
//   if (subGroups.length != 0) {
//     group.subGroups = subGroups
//   } else {
//     group.subGroups = [
//         name: group.name,
//         products: expMenuData.value.products.filter((subGroup) => subGroup.parentGroup === group.id)
//       }
//     ]
//   }
//   // Fill sub with products
//   for (const [subGroupIndex, subGroup] of group.subGroups.entries()) {
//     const products = expMenuData.value.products.filter(
//       (product) => product.parentGroup === subGroup.id
//     )
//     const subSubGroups = expMenuData.value.groups.filter(
//       (subSubGroups) => subSubGroups.parentGroup === subGroup.id
//     )
//     if (subSubGroups.length !== 0) {
//       group.subGroups.push(...subSubGroups)
//     }
//     if (products.length !== 0) {
//       subGroup.products = products
//     }
//     if (subGroup.products == null) {
//       subGroupIndexRemove.value.push(subGroupIndex)
//     }
//   }
//   if (group.subGroups.length == 1 && group.subGroups[0].products.length == 0) {
//     groupIndexRemove.value.push(productsListExp.value.indexOf(group))
//   }
//   group.subGroups = group.subGroups.filter((_, index) => !subGroupIndexRemove.value.includes(index))
//   group.subGroups.sort((a, b) => a.order - b.order)
// }
// productsListExp.value = productsListExp.value.filter(
//   (_, index) => !groupIndexRemove.value.includes(index)
// )

// productsListExp.value.sort((a, b) => a.order - b.order)
// // console.log(productsListExp)

// productsStore.setProductsList(productsListExp.value)

// const onCategorySelect = ({ item }) => {
//   selectedCategory.value = item
//   productsList.value = []
//   bufferArr.value = []

//   selectedCategory.value.products.forEach((p) => {
//     if (p.sizePrices[0].price.currentPrice > 0) {
//       p.chain.forEach((category) => {
//         const categoryExisted = productsList.value.find(({ name }) => name === category)

//         /* Мапим с данными из заказа */
//         const rawOrderData = window.localStorage.getItem('order')

//         if (rawOrderData) {
//           try {
//             const order = JSON.parse(rawOrderData)

//             if (order.products) {
//               const existedProduct = order.products.find((item) => item.id === p.id)

//               if (existedProduct) {
//                 p.selected = existedProduct
//               }
//             }
//           } catch (error) {
//             console.log('Ошибка добавления в заказа', error)
//           }
//         }

//         if (!categoryExisted) {
//           productsList.value.push({
//             name: category,
//             products: [p]
//           })
//         } else {
//           categoryExisted.products.push(p)
//         }

//         for (let i = 0; i < productsList.value.length; i++) {
//           bufferArr.value[i] = {
//             name: productsList.value[i].name,
//             products: productsList.value[i].products.slice(0, cardsPerLine.value * 4),
//             id: i + 1
//           }
//           productsLength.value[i] = cardsPerLine.value * 4
//         }
//       })
//     }
//   })

//   if (scrollElement.value) {
//     scrollElement.value.scrollIntoView()
//   }
//   scrollBody.value.scrollBy(0, -40)
// }

const isDishVisible = ref(false)
const isOrderVisible = ref(false)
const isSearchVisible = ref(false)

const toggleDish = (product) => {
  isDishVisible.value = !isDishVisible.value
  selectedProduct.value = product
}

const onOrderUpdate = () => {
  const rawOrderData = window.localStorage.getItem('order')
  try {
    if (rawOrderData) {
      const order = JSON.parse(rawOrderData)
      menuOrderCount.value = order.products.reduce(
        (accumulator, item) => accumulator + item.amount,
        0
      )
    }
  } catch (error) {
    console.log('Ошибка добавления в заказа', error)
  }
}

// onMounted(async () => {
//   const storageMenu = window.localStorage.getItem('menu')
//   menuData.value = storageMenu ? JSON.parse(storageMenu) : null

//   if (!menuData.value) {
//     isLoading.value = true
//     menuData.value = (await axios.get('/menu')).data
//     isLoading.value = false
//   }

//   const productCategories = menuData.value.productCategories
//   categories.value = productCategories.filter(({ isDeleted }) => !isDeleted)

//   menuData.value.products.forEach((p) => {
//     const parentGroup = menuData.value.groups.find((group) => group.id === p.parentGroup)

//     if (parentGroup) {
//       const searchedGroup = menu.value.find((g) => g.id === p.parentGroup)
//       const isGroupExist = Boolean(searchedGroup)

//       if (!isGroupExist) {
//         menu.value.push({
//           ...parentGroup,
//           products: [p]
//         })
//       } else {
//         searchedGroup.products.push(p)
//       }
//     }
//   })

//   let filteredGroups = menuData.value.groups.filter((p) => !p.isDeleted)
//   // .filter((p) => !p.isIncludedInMenu);

//   menuData.value.products = menuData.value.products
//     .filter((p) => !p.isDeleted)
//     .filter((p) => p.type === 'Dish')
//   // .filter((p) => !p.doNotPrintInCheque)

//   let currentProductIndex = 0
//   let currentParentGroup = null
//   let groupsList = []
//   const menuGroups = []

//   while (true) {
//     if (currentProductIndex >= menuData.value.products.length) break

//     const product = menuData.value.products[currentProductIndex]

//     if (!currentParentGroup) {
//       currentParentGroup = filteredGroups.find((group) => group.id === product.parentGroup)

//       if (!currentParentGroup) {
//         ++currentProductIndex
//         // console.log('Продукт: ', product.name)
//       } else {
//         // console.log('currentParentGroup: ', currentParentGroup.name)
//         groupsList.push(currentParentGroup)
//       }
//     } else if (currentParentGroup.parentGroup) {
//       currentParentGroup = filteredGroups.find(
//         (group) => group.id === currentParentGroup.parentGroup
//       )
//       groupsList.push(currentParentGroup)
//     } else {
//       const groupExisted = menuGroups.find((g) => g.id === currentParentGroup.id)
//       if (!groupExisted) {
//         menuGroups.push({
//           ...currentParentGroup,
//           products: [{ ...product, chain: [...groupsList.map(({ name }) => name).reverse()] }]
//         })
//       } else {
//         groupExisted.products.push({
//           ...product,
//           chain: [...groupsList.map(({ name }) => name).reverse()]
//         })
//       }

//       groupsList = []
//       ++currentProductIndex
//       currentParentGroup = null
//     }
//   }

//   menu.value = menuGroups

//   menu.value.forEach((item) => {
//     item.sub = []
//     filteredGroups.map((sub) => {
//       if (sub.parentGroup === item.id) {
//         item.sub.push(sub)
//       }
//     })
//   })

//   const showDish = () => {
//     DishScreen.classlist.remove('hidden-screen')
//   }
// })
</script>
