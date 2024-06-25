<template>
  <div class="relative w-full mb-[55px]">
    <span
      class="font-semibold text-[#000] uppercase text-[25px] leading-[117%] tracking-[0.11em] font-Sitka"
    >
      Выберите {{ name }}
    </span>
  </div>
  <div class="relative w-full flex flex-wrap">
    <slot></slot>
    <!--        <BusinessLunchCard-->
    <!--          :name="'Не выбирать'"-->
    <!--          :description="'-200 руб. от стоимости заказа'"-->
    <!--          :img-src="'/icons/IconCancel.svg'"-->
    <!--        />-->
  </div>
</template>

<script setup>
import { onMounted, ref, defineProps } from 'vue'
import { BusinessLunchCard } from '@/components'
import { useBusinessStore } from '@/stores/business.store'
import { ref } from 'vue'

const businessStore = useBusinessStore()
console.log(businessStore.businessProducts)

const props = defineProps({
  name: {
    type: String
  }
})
</script>
