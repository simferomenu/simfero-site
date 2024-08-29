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
        @choose="toggleDish"
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
      </div>
    </div>
    <BusinessLunchScreen v-if="businessStore.isBusinessVisible" @choose="toggleDish" />
  </div>
</template>

<style scoped></style>

<script setup>
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

const selectedCategory = ref(null)
const isLoading = ref(false)
const selectedProduct = ref(null)
const menuOrderCount = ref(null)
const displayedGroupIndex = ref(0)
const scrollElement = ref(null)
const scrollSection = ref(null)
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
}

const scrollToSubGroup = (subGroupIndex) => {
  const targetElement = scrollBody.value.querySelector(`[data-sub-group-index="${subGroupIndex}"]`)
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth' })
  } else {
    console.log(`"Элемент с индексом - " ${subGroupIndex} Не найден.`)
  }
}

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
</script>
