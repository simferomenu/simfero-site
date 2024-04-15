<template>
  <div class="relative flex w-screen h-screen">
    <SideMenu />
    <div
      class="relative flex flex-col shrink-1 w-full h-screen overflow-auto box-border main-bg py-[40px] pl-[37px]"
    >
      <MenuSection v-for="item in categories" :name="item.name" :key="item.id">
        <MenuCard
          @click="toTuna"
          name="Тунец Мацухиса"
          :price="1200"
          imgUrl="/images/ImageTuna.png"
        />
      </MenuSection>
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { SideMenu, MenuSection, WaiterMenu, MenuCard } from '@/components'
import { useElementBounding } from '@vueuse/core'
import { useRouter } from 'vue-router'

const router = useRouter()

const toTuna = () => {
  router.push('dish/tuna')
}

// const visibleEl = ref(null)
// const { x, y, top, right, bottom, left, width, height } = useElementBounding(visibleEl)

const menu = ref([])
const categories = ref([])
const products = ref([])

onMounted(() => {
  axios.get('https://api.simfero.cirus-it.com/menu').then((response) => {
    const groups = response.data.groups
    categories.value = groups
    // console.log(groups)
    const groupsIdArr = groups.map((obj) => obj.id)
    const products = response.data.products
    console.log(products)
    const productsIdArr = products.map((obj) => obj.id)

    products.forEach((product) => {
      const groupId = product.parentGroup
      // console.log(groupId)
      const group = groups.find(({ id }) => {
        // console.log(id, groupId, id === groupId)
        return id === groupId
      })
      console.log(group)
      const existingItem = menu.find(({ id }) => id === group.id)

      if (!existingItem) {
        menu.push({
          id: group.id,
          name: group.name,
          products: [product]
        })
      } else {
        existingItem.products.push(product)
      }
    })

    // const stringifiedMenu = JSON.stringify(menu)

    // localStorage.setItem('menu', stringifiedMenu)
  })
})
</script>
