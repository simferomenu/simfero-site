<template>
  <div class="relative flex w-screen h-screen pointer-events-none">
    <SideMenu :categories="menu" @select="onCategorySelect"/>
    <div
      class="relative flex flex-col shrink-1 w-full h-screen overflow-auto box-border main-bg py-[40px] pl-[37px] pointer-events-auto"
    >
      <div v-if="selectedCategory">
        <MenuSection
          v-for="item in productsList"
          :name="item.name"
          :key="item.name"
        >
          <MenuCard
            v-for="product in item.products"
            :key="product.id"
            :name="product.name"
            :price="product.sizePrices[0].price.currentPrice"
            :imgUrl="product.imageLinks[0] || '/images/ImageBasicDish.png'"
            @click="toTuna"
          />
          <!-- Заполняющий div, блокирующий тапы -->
          <div class="flex-1 mr-auto !pointer-events-none"></div>
        </MenuSection>

<!--        <div class="fixed top-[35vh] right-[30vw] w-[200px] h-[200px] z-[3] pointer-events-none">-->
<!--          <img src="/icons/loadingBlack.gif" alt="" />-->
<!--        </div>-->
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { SideMenu, MenuSection, MenuCard } from '@/components'

const router = useRouter();
const menuData = ref(null);
const menu = ref([]);
const categories = ref([]);
const selectedCategory = ref(null);
const productsList = ref([]);

const onCategorySelect = ({ item }) => {
  selectedCategory.value = item
  productsList.value = [];

  selectedCategory.value.products.forEach((p) => {
    if (p.sizePrices[0].price.currentPrice > 0) {
      p.chain.forEach((category) => {
        const categoryExisted = productsList.value.find(({ name }) => name === category);

        if (!categoryExisted) {
          productsList.value.push({
            name: category,
            products: [p],
          });
        } else {
          categoryExisted.products.push(p)
        }
      })
    }
  });
};

const toTuna = () => {
  router.push('dish/tuna')
}

onMounted(async () => {
  const storageMenu = window.localStorage.getItem('menu')
  menuData.value = storageMenu ? JSON.parse(storageMenu) : null

  if (!menuData.value) {
    menuData.value = (await axios.get('/menu')).data
  }

  const productCategories = menuData.value.productCategories
  categories.value = productCategories.filter(({ isDeleted }) => !isDeleted)

  menuData.value.products.forEach((p) => {
    const parentGroup = menuData.value.groups.find((group) => group.id === p.parentGroup);

    if (parentGroup) {
      const searchedGroup = menu.value.find((g) => g.id === p.parentGroup);
      const isGroupExist = Boolean(searchedGroup);

      if (!isGroupExist) {
        menu.value.push({
          ...parentGroup,
          products: [p],
        });
      } else {
        searchedGroup.products.push(p);
      }
    }
  })

  let filteredGroups = menuData.value.groups
    .filter((p) => !p.isDeleted)
    // .filter((p) => !p.isIncludedInMenu);

  menuData.value.products = menuData.value.products
    .filter((p) => !p.isDeleted)
    .filter((p) => p.type === 'Dish')

  let currentProductIndex = 0;
  let currentParentGroup = null;
  let groupsList = [];
  const menuGroups = [];

  while (true) {
    if (currentProductIndex >= menuData.value.products.length) break;

    const product = menuData.value.products[currentProductIndex];

    if (!currentParentGroup) {
      currentParentGroup = filteredGroups.find((group) => group.id === product.parentGroup);

      if (!currentParentGroup) {
        ++currentProductIndex;
        console.log('Продукт: ', product.name);
      } else {
        groupsList.push(currentParentGroup.name);
      }
    }
    else if (currentParentGroup.parentGroup) {
      currentParentGroup = filteredGroups.find((group) => group.id === currentParentGroup.parentGroup);
      groupsList.push(currentParentGroup.name);
    }
    else {
      const groupExisted = menuGroups.find((g) => g.id === currentParentGroup.id);
      if (!groupExisted) {
        menuGroups.push({
          ...currentParentGroup,
          products: [{ ...product, chain: [...groupsList.reverse()] }]
        })
      } else {
        groupExisted.products.push({ ...product, chain: [...groupsList.reverse()] })
      }

      groupsList = [];
      ++currentProductIndex;
      currentParentGroup = null;
    }
  }

  menu.value = menuGroups;

  onCategorySelect({ item: menu.value[0] });
})
</script>
