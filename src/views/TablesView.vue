<template>
  <IconCross @click="toWaiter" />
  <IconBack @click="toWaiter" />
  <div
    class="relative w-screen h-screen box-border waiter-bg flex flex-col py-[35px] !overflow-hidden pointer-events-none"
  >
    <div
      class="relative flex w-full h-fit box-border justify-center items-center mt-[70px] shrink-0"
    >
      <div class="font-Sitka text-[36px] tracking-[0.11em] uppercase font-[400] text-[#fff]">
        Выберите столик для гостей
      </div>
      <div class="relative box-border flex items-center"></div>
    </div>

    <div class="flex relative w-full h-[100%] mt-[40px] box-border pl-[40px] overflow-hidden">
      <div
        class="relative w-1/2 shrink-0 h-full flex flex-col mr-[20px]"
        v-for="zone in zones"
        :key="zone.name"
      >
        <div class="relative flex w-full mb-[40px]">
          <div class="absolute top-[20vh] left-1/2 translate-x-[-70%] w-[150px] h-[150px]">
            <img src="/icons/loading.gif" alt="" />
          </div>
          <span
            class="font-semibold text-[#fff] uppercase text-[25px] leading-[117%] tracking-[0.11em] font-Sitka mr-[14px] block shrink-0 w-fit"
          >
            {{ zone.name }}
          </span>
          <div class="relative w-full flex shrink-1 items-center">
            <img class="block h-[15px] w-auto" src="/icons/IconRhombusWhite.svg" alt="" />
            <div class="h-[1px] w-full bg-[#fff]"></div>
          </div>
        </div>
        <div class="relative w-full flex flex-wrap overflow-auto !pointer-events-auto">
          <number-cell
            :key="item.id"
            :value="item.number"
            :id="item.id"
            :is-selected="isSelected(item)"
            v-for="item in zone.tables"
            @selected="onCellSelected"
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
        <span
          class="font-Segoe font-semibold text-[20px] tracking-[0.13em] uppercase text-gold cursor-pointer"
          @click="onTablesSelected"
        >
          Выбрать
        </span>
        <div class="absolute bottom-[-20px] right-[-285px] w-[600px] flex shrink-1 items-center">
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

const router = useRouter()
const toWaiter = () => {
  router.push('/waiter')
}

const selectedTables = ref([])
const zones = ref([])

const onCellSelected = ({ id }) => {
  const isExist = selectedTables.value.find((item) => item === id)

  if (!isExist) {
    selectedTables.value.push(id)
  } else {
    selectedTables.value = selectedTables.value.filter((item) => item != id)
  }

  window.localStorage.setItem('selectedTables', JSON.stringify(selectedTables.value))
}

const isSelected = ({ id }) => {
  if (!selectedTables.value) return false;
  return Boolean(selectedTables.value.find((item) => item === id));
}

const onTablesSelected = () => {
  router.push('/')
}

onMounted(() => {
  axios.get('/tables').then((response) => {
    zones.value = response.data
    selectedTables.value = JSON.parse(window.localStorage.getItem('selectedTables'))
  })
})
</script>

<style scoped></style>
