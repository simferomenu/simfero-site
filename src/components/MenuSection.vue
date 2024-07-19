<template>
  <div class="relative w-full flex flex-col" ref="sectionElement">
    <div class="w-full flex items-center mb-[50px] animated-long">
      <span
        class="font-semibold text-[#000] uppercase text-[25px] leading-[117%] tracking-[0.11em] font-Sitka mr-[14px] block shrink-0 w-fit"
      >
        {{ name }}
      </span>
      <div class="relative w-full flex shrink-1 items-center">
        <img class="block h-[15px] w-auto" src="/icons/IconRhombusBlack.svg" alt="" />
        <div class="h-[1px] w-full bg-[#000]"></div>
      </div>
    </div>
    <div class="relative w-full flex flex-wrap">
      <slot> </slot>
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useProductsStore } from '@/stores/products.store'

const router = useRouter()
const sectionElement = ref(null)
const productsStore = useProductsStore()

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  groupIndex: {
    type: Number
  }
})

const handleVisibilityChange = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const sectionId = parseInt(entry.target.getAttribute('data-id'))
      if (sectionId == 0 || sectionId % 2 == 0) {
        for (let i = sectionId + 2; i < sectionId + 4; i++) {
          if (productsStore.productsList[props.groupIndex].subGroups[i] != null) {
            if (
              productsStore.productsList[props.groupIndex].subGroups[i].products[0].isRendered ==
              false
            ) {
              for (const product of productsStore.productsList[props.groupIndex].subGroups[i]
                .products) {
                product.isRendered = true
              }
            }
          }
        }
      }
    }
  })
}

let observer = null

onMounted(() => {
  observer = new IntersectionObserver(handleVisibilityChange, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  })

  if (sectionElement.value) {
    observer.observe(sectionElement.value)
  }
})

const toTuna = () => {
  router.push('dish/tuna')
}
</script>
