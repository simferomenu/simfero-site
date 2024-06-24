<template>
  <div class="fixed box-border py-[110px] w-screen h-screen flex flex-col items-center justify-center z-[5] waiter-bg">
    <IconCross
      v-if="anyTable"
      class="animated"
      @click="toMain"
    />
    <div class="relative w-fit flex items-center h-[93px] shrink-0 mb-[45px] animated-down">
      <img class="h-full w-auto" src="/icons/IconLogo.png" alt="" />
      <div class="relative flex flex-col ml-[15px]">
        <h1 class="font-Sitka font-normal text-[47px] leading-[96%] tracking-[0.09em] uppercase text-gold">
          SIMFERO
        </h1>
        <span class="font-Sitka font-normal text-[15px] text-gold tracking-[0.07em]">
          панорамный ресторан
        </span>
      </div>
    </div>
    <div class="relative flex items-center shrink h-full">
      <div class="flex flex-col items-center justify-center h-full animated-up" @click="toTables">
        <div class="h-[250px] w-[250px] mb-[70px]">
          <img src="/images/spinner.gif" class="absolute top-0" v-if='isMenuLoading'/>
          <img class="w-full h-full" src="/icons/IconKnifeFork.svg" alt="" v-else/>
        </div>
        <span class="font-Sitka text-[25px] font-normal tracking-[0.02em] uppercase text-center text-[#fff]">
          Новые гости
        </span>
      </div>

      <!-- <div class="relative h-full w-[1px] bg-gold mx-[140px]">
        <img
          class="absolute top-1/2 left-0 h-[10px] w-[10px]"
          src="/icons/IconRhombusGold.svg"
          alt=""
        />
      </div> -->
      <!-- <div class="flex flex-col items-center justify-center h-full">
        <div class="h-[250px] w-[250px] mb-[70px]">
          <img class="w-full h-full" src="/icons/IconKnifeSpoon.svg" alt="" />
        </div>
        <span
          class="font-Sitka text-[25px] font-normal tracking-[0.02em] uppercase text-center text-[#fff]"
          >Дополнить заказ</span
        >
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { IconCross } from '@/components';

const router = useRouter();
const anyTable = JSON.parse(window.localStorage.getItem('selectedTables'));
const isMenuLoading = ref(true);

const toMain = () => {
  router.push('/');
}

const toTables = () => {
  router.push('/tables');
}

onMounted(() => {
  axios.get('/menu').then((response) => {
    window.localStorage.setItem('menu', JSON.stringify(response.data));
    isMenuLoading.value = false;
  });
})
</script>

<style scoped></style>
