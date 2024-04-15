<template>
  <IconCross @click="toWaiter" />
  <IconBack @click="toWaiter" />
  <div
    class="relative w-screen h-screen box-border waiter-bg flex flex-col py-[35px] overflow-hidden"
  >
    <div class="relative flex w-full h-fit box-border justify-center items-center mt-[70px] shrink-0">
      <div class="font-Sitka text-[36px] tracking-[0.11em] uppercase font-[400] text-[#fff]">
        Выберите столик для гостей
      </div>
      <div class="relative box-border flex items-center"></div>
    </div>

    <div class="flex relative w-full h-[100%] mt-[40px] box-border pl-[40px] overflow-auto">
      <div
        class="relative w-1/2 shrink-0 h-full flex flex-col mr-[20px]"
        v-for='zone in zones'
      >
        <div class="relative flex w-full mb-[40px]">
          <span class="font-semibold text-[#fff] uppercase text-[25px] leading-[117%] tracking-[0.11em] font-Sitka mr-[14px] block shrink-0 w-fit">
            {{ zone.name }}
          </span>
          <div class="relative w-full flex shrink-1 items-center">
            <img class="block h-[15px] w-auto" src="/icons/IconRhombusWhite.svg" alt="" />
            <div class="h-[1px] w-full bg-[#fff]"></div>
          </div>
        </div>
        <div class="w-full flex flex-wrap overflow-auto">
          <number-cell
            :key="item.id"
            :value="item.number"
            :id='item.id'
            v-for="item in zone.tables"
            @selected='onCellSelected'
          />
        </div>
      </div>
    </div>


    <div class="w-full relative flex justify-between box-border px-[40px] mt-[40px] shrink-0 h-fit">
      <div class="flex flex-col w-[320px]">
<!--        <span class="font-Segoe font-semibold text-[20px] tracking-[0.13em] uppercase text-gold"-->
<!--          >10 стол, основной зал</span-->
<!--        >-->
<!--        <div class="flex justify-between items-center mt-[12px]">-->
<!--          <span class="font-Segoe font-[350] text-[14px] tracking-[0.05em] text-[#fff]"-->
<!--            >3000 рублей депозит</span-->
<!--          >-->
<!--          <span class="font-Segoe font-[350] text-[14px] tracking-[0.05em] text-[#fff]"-->
<!--            >Бронь стола на 11:00</span-->
<!--          >-->
<!--        </div>-->
      </div>
      <div class="relative flex flex-col h-full w-[310px]">
        <span class="font-Segoe font-semibold text-[20px] tracking-[0.13em] uppercase text-gold"
          >Выбрать</span
        >
        <div class="absolute bottom-0 right-[-285px] w-[600px] flex shrink-1 items-center">
          <img class="block h-[15px] w-auto" src="/icons/IconRhombusGold.svg" alt="" />
          <div class="h-[1px] w-full bg-gold"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import { IconCross, IconBack, NumberCell } from '@/components'

const router = useRouter();
const toWaiter = () => {
  router.push('/waiter')
}

const zones = ref([]);
const zal = ref([]);
const terrace = ref([]);

const onCellSelected = ({ id }) => {
  console.log(id);
}

onMounted(() => {
  axios.get('/tables').then((response) => {
    zones.value = response.data;

    terrace.value = response.data[0].tables
    zal.value = response.data[1].tables
  })
})
</script>

<style scoped></style>
