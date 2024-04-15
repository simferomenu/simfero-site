<template>
  <div class="relative flex w-screen h-screen pointer-events-none">
    <SideMenu :categories="categories" />
    <div
      class="relative flex flex-col shrink-1 w-full h-screen overflow-auto box-border main-bg py-[40px] pl-[37px] pointer-events-auto"
    >
      <!-- Спиннер при загрузке категорий -->
      <div class="fixed top-[35vh] right-[30vw] w-[200px] h-[200px] z-[3]">
        <img src="/icons/loadingBlack.gif" alt="" />
      </div>
      <MenuSection v-for="item in categories" :name="item.name" :key="item.id">
        <MenuCard
          @click="toTuna"
          name="Тунец Мацухиса"
          :price="1200"
          imgUrl="/images/ImageBasicDish.png"
        />
        <!-- Заполняющий div, блокирующий тапы -->
        <div class="flex-1 mr-auto !pointer-events-none"></div>
      </MenuSection>
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { SideMenu, MenuSection, WaiterMenu, MenuCard } from '@/components'
import { useElementBounding } from '@vueuse/core'

const router = useRouter()

const toTuna = () => {
  router.push('dish/tuna')
}

// const visibleEl = ref(null)
// const { x, y, top, right, bottom, left, width, height } = useElementBounding(visibleEl)

const menuData = ref(null)
const menu = ref([])
const categories = ref([])
const products = ref([])

onMounted(async () => {
  const storageMenu = window.localStorage.getItem('menu')
  menuData.value = storageMenu ? JSON.parse(storageMenu) : null

  if (!menuData.value) {
    menuData.value = (await axios.get('/menu')).data
  }

  const groups = menuData.value.productCategories
  categories.value = groups.filter(({ isDeleted }) => !isDeleted)

  // console.log(groups)
  // const groupsIdArr = groups.map((obj) => obj.id)
  // const products = menu.value.products
  // console.log(products)
  // const productsIdArr = products.map((obj) => obj.id)
  //
  // products.forEach((product) => {
  //   const groupId = product.parentGroup
  //   // console.log(groupId)
  //   const group = groups.find(({ id }) => {
  //     // console.log(id, groupId, id === groupId)
  //     return id === groupId
  //   })
  //   console.log(group)
  //   const existingItem = menu.find(({ id }) => id === group.id)
  //
  //   if (!existingItem) {
  //     menu.push({
  //       id: group.id,
  //       name: group.name,
  //       products: [product]
  //     })
  //   } else {
  //     existingItem.products.push(product)
  //   }
  // })

  // const stringifiedMenu = JSON.stringify(menu)

  // localStorage.setItem('menu', stringifiedMenu)
})
</script>
