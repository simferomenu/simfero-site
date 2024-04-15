<template>
  <div
    class="relative w-[312px] h-screen bg-darkBlue flex flex-col box-border py-[30px] px-[28px] shrink-0 border-r-gold border-solid border-r-[2px] default-transition pointer-events-none"
  >
    <div class="relative w-full flex items-center h-[71px]">
      <img class="h-full w-auto" src="/icons/IconLogo.png" alt="" />
      <div class="relative flex flex-col ml-[15px]">
        <h1
          class="font-Sitka font-normal text-[36px] leading-[96%] tracking-[0.09em] uppercase text-gold pointer-events-auto"
          @click="toWaiterView"
        >
          SIMFERO
        </h1>
        <span class="font-Sitka font-normal text-[11px] text-gold tracking-[0.07em]">панорамный ресторан</span>
      </div>
    </div>
    <div class="relative w-full flex flex-col mt-[90px]">
      <ul class="[&>*:not(:last-child)]:mb-[20px]">
        <li
          v-for="item in categories"
          :key='item.name'
        >
          <a
            :class="[
              'menu-link',
              {
                active: item.id === activeItem.id
              }
            ]"
            @click="onCategorySelect(item)"
          >
            {{ item.name }}
          </a>
        </li>
      </ul>
    </div>
    <div class="relative w-full flex flex-col mt-[150px] [&>*:not(:last-child)]:mb-[20px]">
      <div class="relative flex items-center !pointer-events-auto">
        <img class="w-[32px] h-[32px]" src="/icons/IconExclamation.svg" alt="" />
        <span class="menu-link ml-[15px]">Интерактивы</span>
      </div>
      <div class="relative flex items-center">
        <span @click="toOrderView" class="pl-[32px] menu-link ml-[15px] !pointer-events-auto"
          >Мой заказ</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { ref, watch, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  categories: {
    type: Array,
  }
});

const emit = defineEmits(['select']);
const router = useRouter();
const activeItem = ref([]);

watch(props, (data) => {
  activeItem.value = data.categories[0];
});

const onCategorySelect = (item) => {
  activeItem.value = item;
  emit('select', { item });
}
const toOrderView = () => {
  router.push('/order')
}

const toWaiterView = () => {
  router.push('/waiter')
}
</script>
