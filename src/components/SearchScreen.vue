<template>
  <div
    class="fixed top-0 left-0 flex justify-center items-center w-screen h-screen search-bg box-border overflow-hidden z-[5] !pointer-events-auto"
  >
    <IconCross @click="$emit('closeSearch')" />
    <div class="relative w-[455px] h-[505px] flex flex-col box-border">
      <div class="relative w-full h-fit mb-[30px] shrink-0 box-border pr-[12px]">
        <input type="text" class="input-field" placeholder="Название блюда..." v-model="searchTerm"/>
        <img
          class="absolute left-[11px] top-[12px] w-[41px] h-[41px] pointer-events-none user-select-none"
          src="/icons/IconInputLogo.svg"
          alt=""
        />
      </div>
      <div
        class="w-full h-full !overflow-auto [&>*:not(:last-child)]:mb-[20px] box-border pr-[12px]"
      >
        <FilteredProduct v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        @click="onChoose(product)"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconCross, FilteredProduct } from '@/components'
import { useProductsStore } from '@/stores/products.store';
import { ref, watch } from 'vue';

const emit = defineEmits(['choose'])

const searchTerm=ref(null)

const productsStore = useProductsStore()
const menuData = ref(null)
const menuProducts = ref(null)
const storageMenu = window.localStorage.getItem('menu')
const filteredProducts=ref([])
menuData.value = storageMenu ? JSON.parse(storageMenu) : null

const onChoose = (product) => emit('choose', product)

menuProducts.value = storageMenu ? JSON.parse(storageMenu) : null

const filteredMenuProducts = menuProducts.value.products
  .filter((product) => product.type === 'Dish' || product.type === 'Good')
  .filter((product) => !product.isDeleted)
  .filter((product) => product.sizePrices[0].price.currentPrice!=0)
  .filter((product) => product.additionalInfo==null)

const searchArray = filteredMenuProducts

watch(() => searchTerm.value, () => {
  filteredProducts.value = []
  if (searchTerm.value.length!=0) {
    const lowercaseSearchTerm = searchTerm.value.toLowerCase()
    filteredProducts.value = searchArray.filter((product) =>
      product.name.toLowerCase().includes(lowercaseSearchTerm)
    ) || []
  }
})
</script>
