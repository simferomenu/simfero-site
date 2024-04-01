<template>
  <div class="relative flex w-screen h-screen">
    <SideMenu />
    <div
      class="relative flex flex-col shrink-1 w-full h-screen overflow-auto box-border main-bg py-[40px] pl-[37px]"
    >
      <MenuSection name="Паста и ризотто" />
      <MenuSection name="Холодные закуски" />
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import dishesList from '@/data/dishes.json'
import { ref } from 'vue'
import { SideMenu, MenuSection } from '@/components'
import { useElementBounding } from '@vueuse/core'

const visibleEl = ref(null)
const { x, y, top, right, bottom, left, width, height } = useElementBounding(visibleEl)
</script>
