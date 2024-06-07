<template>
  <div class="relative flex w-screen h-screen pointer-events-none">
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
      :categories="menu"
      @select="onCategorySelect"
      :order-count="menuOrderCount"
      @openOrder="isOrderVisible = true"
    />
    <div
      class="relative flex flex-col shrink-1 w-full h-screen overflow-auto box-border main-bg py-[40px] pl-[37px] pointer-events-auto"
      ref="scrollBody"
    >
      <div
        v-if="isLoading"
        class="fixed top-[35vh] w-[200px] h-[200px] z-[3] pointer-events-none right-[calc(50vw-200px)]"
      >
        <img src="/icons/loadingBlack.gif" alt="" />
      </div>
      <div ref="scrollElement" v-if="selectedCategory">
        <!-- <MenuSection v-for="item in productsList" :name="item.name" :key="item.name">
          <MenuCard
            v-for="product in item.products"
            :product="product"
            :key="product.id"
            @choose="toggleDish"
            @order-update="onOrderUpdate"
          />
        </MenuSection> -->
        <MenuSection v-for="(item, sectionIndex) in bufferArr" :name="item.name" :key="item.name">
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
        </MenuSection>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import axios from 'axios'
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useScrollLock } from '@vueuse/core'

import { SideMenu, MenuSection, MenuCard, DishScreen, OrderScreen } from '@/components'

const router = useRouter()
const menuData = ref(null)
const menu = ref([])
const categories = ref([])
const selectedCategory = ref(null)
const productsList = ref([])
const isLoading = ref(false)
const selectedProduct = ref(null)
const menuOrderCount = ref(null)
const renderedCount = ref(null)
const productsLength = ref([])

const scrollElement = ref(null)
const scrollBody = ref(null)
const cardsPerLine = ref(null)
const bufferArr = ref([])

const viewWidth = window.innerWidth

if (viewWidth < 1112) {
  cardsPerLine.value = 2
} else if (viewWidth >= 1112 && viewWidth < 1366) {
  cardsPerLine.value = 3
} else {
  cardsPerLine.value = 4
}

renderedCount.value = cardsPerLine.value * 4

const onBufferArrExpand = (sectionIndex, renderLineTrigger) => {
  for (
    let i = (renderLineTrigger - 1) * renderedCount.value;
    i < renderLineTrigger * renderedCount.value;
    i++
  ) {
    bufferArr.value[sectionIndex].products[i] = productsList.value[sectionIndex].products[i]
  }
  productsLength.value[sectionIndex] = renderLineTrigger * renderedCount.value
  bufferArr.value[sectionIndex].products = bufferArr.value[sectionIndex].products.filter(
    function (element) {
      return element !== undefined
    }
  )
}

const onCategorySelect = ({ item }) => {
  selectedCategory.value = item
  productsList.value = []
  bufferArr.value = []

  selectedCategory.value.products.forEach((p) => {
    if (p.sizePrices[0].price.currentPrice > 0) {
      p.chain.forEach((category) => {
        const categoryExisted = productsList.value.find(({ name }) => name === category)

        /* Мапим с данными из заказа */
        const rawOrderData = window.localStorage.getItem('order')

        if (rawOrderData) {
          try {
            const order = JSON.parse(rawOrderData)

            if (order.products) {
              const existedProduct = order.products.find((item) => item.id === p.id)

              if (existedProduct) {
                p.selected = existedProduct
              }
            }
          } catch (error) {
            console.log('Ошибка добавления в заказа', error)
          }
        }

        if (!categoryExisted) {
          productsList.value.push({
            name: category,
            products: [p]
          })
        } else {
          categoryExisted.products.push(p)
        }

        for (let i = 0; i < productsList.value.length; i++) {
          bufferArr.value[i] = {
            name: productsList.value[i].name,
            products: productsList.value[i].products.slice(0, cardsPerLine.value * 4),
            id: i + 1
          }
          productsLength.value[i] = cardsPerLine.value * 4
        }
      })
    }
  })

  if (scrollElement.value) {
    scrollElement.value.scrollIntoView()
  }
  scrollBody.value.scrollBy(0, -40)
}

const isDishVisible = ref(false)
const isOrderVisible = ref(false)

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

// watch(
//   () => bufferArr.value[0].products[0].selected,
//   () => {
//     console.log('sdsdsdsd')
//   }
// )

onMounted(async () => {
  const storageMenu = window.localStorage.getItem('menu')
  menuData.value = storageMenu ? JSON.parse(storageMenu) : null

  if (!menuData.value) {
    isLoading.value = true
    menuData.value = (await axios.get('/menu')).data
    isLoading.value = false
  }

  const productCategories = menuData.value.productCategories
  categories.value = productCategories.filter(({ isDeleted }) => !isDeleted)

  menuData.value.products.forEach((p) => {
    const parentGroup = menuData.value.groups.find((group) => group.id === p.parentGroup)

    if (parentGroup) {
      const searchedGroup = menu.value.find((g) => g.id === p.parentGroup)
      const isGroupExist = Boolean(searchedGroup)

      if (!isGroupExist) {
        menu.value.push({
          ...parentGroup,
          products: [p]
        })
      } else {
        searchedGroup.products.push(p)
      }
    }
  })

  let filteredGroups = menuData.value.groups.filter((p) => !p.isDeleted)
  // .filter((p) => !p.isIncludedInMenu);

  menuData.value.products = menuData.value.products
    .filter((p) => !p.isDeleted)
    .filter((p) => p.type === 'Dish')
  // .filter((p) => !p.doNotPrintInCheque)

  let currentProductIndex = 0
  let currentParentGroup = null
  let groupsList = []
  const menuGroups = []

  while (true) {
    if (currentProductIndex >= menuData.value.products.length) break

    const product = menuData.value.products[currentProductIndex]

    if (!currentParentGroup) {
      currentParentGroup = filteredGroups.find((group) => group.id === product.parentGroup)

      if (!currentParentGroup) {
        ++currentProductIndex
        // console.log('Продукт: ', product.name)
      } else {
        // console.log('currentParentGroup: ', currentParentGroup.name)
        groupsList.push(currentParentGroup)
      }
    } else if (currentParentGroup.parentGroup) {
      currentParentGroup = filteredGroups.find(
        (group) => group.id === currentParentGroup.parentGroup
      )
      groupsList.push(currentParentGroup)
    } else {
      const groupExisted = menuGroups.find((g) => g.id === currentParentGroup.id)
      if (!groupExisted) {
        menuGroups.push({
          ...currentParentGroup,
          products: [{ ...product, chain: [...groupsList.map(({ name }) => name).reverse()] }]
        })
      } else {
        groupExisted.products.push({
          ...product,
          chain: [...groupsList.map(({ name }) => name).reverse()]
        })
      }

      groupsList = []
      ++currentProductIndex
      currentParentGroup = null
    }
  }

  menu.value = menuGroups

  menu.value.forEach((item) => {
    item.sub = []
    filteredGroups.map((sub) => {
      if (sub.parentGroup === item.id) {
        item.sub.push(sub)
      }
    })
  })

  onCategorySelect({ item: menu.value[0] })

  const showDish = () => {
    DishScreen.classlist.remove('hidden-screen')
  }
})
</script>
