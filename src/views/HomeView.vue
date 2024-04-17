<template>
  <div class="relative flex w-screen h-screen pointer-events-none">
    <DishScreen v-show="isDishVisible" @closeDish="toggleDish" class="default-transition" />
    <SideMenu :categories="menu" @select="onCategorySelect" />
    <div
      class="relative flex flex-col shrink-1 w-full h-screen overflow-auto box-border main-bg py-[40px] pl-[37px] pointer-events-auto"
    >
      <div
        v-if="isLoading"
        class="fixed top-[35vh] w-[200px] h-[200px] z-[3] pointer-events-none loader"
      >
        <img src="/icons/loadingBlack.gif" alt="" />
      </div>

      <div id="menu-body" v-if="selectedCategory">
        <MenuSection v-for="item in productsList" :name="item.name" :key="item.name">
          <MenuCard
            class="animated-up"
            v-for="product in item.products"
            :key="product.id"
            :name="product.name"
            :price="product.sizePrices[0].price.currentPrice"
            :imgUrl="product.imageLinks[0] || '/images/ImageBasicDish.png'"
            @click="toggleDish"
          />
          <!-- Заполняющий div, блокирующий тапы -->
          <div class="flex-1 mr-auto !pointer-events-none"></div>
        </MenuSection>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loader {
  right: calc(50vw - 200px);
}
</style>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { SideMenu, MenuSection, MenuCard, DishScreen } from '@/components'

const router = useRouter()
const menuData = ref(null)
const menu = ref([])
const categories = ref([])
const selectedCategory = ref(null)
const productsList = ref([])
const isLoading = ref(false)

const onCategorySelect = ({ item }) => {
  selectedCategory.value = item
  productsList.value = []

  selectedCategory.value.products.forEach((p) => {
    if (p.sizePrices[0].price.currentPrice > 0) {
      p.chain.forEach((category) => {
        const categoryExisted = productsList.value.find(({ name }) => name === category)

        if (!categoryExisted) {
          productsList.value.push({
            name: category,
            products: [p]
          })
        } else {
          categoryExisted.products.push(p)
        }
      })
    }
  })

  let element = ref(document.getElementById('menu-body'))
  element.value.scrollIntoView()
}

const isDishVisible = ref(false)

const toggleDish = () => {
  isDishVisible.value = !isDishVisible.value
}

const toTuna = () => {
  router.push('dish/tuna')
}

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
        console.log('Продукт: ', product.name)
      } else {
        groupsList.push(currentParentGroup.name)
      }
    } else if (currentParentGroup.parentGroup) {
      currentParentGroup = filteredGroups.find(
        (group) => group.id === currentParentGroup.parentGroup
      )
      groupsList.push(currentParentGroup.name)
    } else {
      const groupExisted = menuGroups.find((g) => g.id === currentParentGroup.id)
      if (!groupExisted) {
        menuGroups.push({
          ...currentParentGroup,
          products: [{ ...product, chain: [...groupsList.reverse()] }]
        })
      } else {
        groupExisted.products.push({ ...product, chain: [...groupsList.reverse()] })
      }

      groupsList = []
      ++currentProductIndex
      currentParentGroup = null
    }
  }

  menu.value = menuGroups

  onCategorySelect({ item: menu.value[0] })

  const showDish = () => {
    DishScreen.classlist.remove('hidden-screen')
  }
})
</script>
