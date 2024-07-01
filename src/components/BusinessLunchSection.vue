<template>
  <div class="relative w-full mb-[55px]">
    <span
      class="font-semibold text-[#000] uppercase text-[25px] leading-[117%] tracking-[0.11em] font-Sitka"
    >
      Выберите {{ title }}
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
import { ref } from 'vue';

const props = defineProps({
  subGroup: {
    type: Object
  }
})

const title = ref(null)
title.value = props.subGroup.name.replaceAll('ДЕЛОВЫЕ ОБЕДЫ', "").replaceAll('ДО', "")
</script>
