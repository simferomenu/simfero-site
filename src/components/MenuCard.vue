<template>
  <div
    class="relative flex flex-col h-[340px] w-[214px] box-border rounded-[19px] menu-card-bg mr-[40px] mb-[40px] shrink-0 pointer-events-auto"
    @click="onChoose"
  >
    <div class="relative h-1/2 w-full shrink-0">
      <div class="absolute w-full h-auto top-[-15%] left-[-15%] overflow-hidden rounded-[100px]">
        <img :src="imgUrl" alt="" />
      </div>
<!--      <div class="absolute w-[5px] h-auto top-[11px] right-[13px]">-->
<!--        <img src="/icons/IconThreeDots.svg" alt="" />-->
<!--      </div>-->
    </div>
    <div class="h-full w-full box-border p-[20px] flex flex-col justify-between">
      <span
        class="font-Segoe font-semibold text-[16px] leading-[150%] tracking-[0.17em] uppercase text-[#000]"
        >{{ name }}</span
      >
      <span
        class="font-Segoe font-semibold text-[18px] leading-[128%] tracking-[0.04em] text-[#000]"
      >
        {{ price }} Руб.
      </span>
      <IconPlus :isBlack="true" @click="onAddToOrder"/>
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { defineEmits } from 'vue';
import { IconPlus } from '@/components';

defineProps({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imgUrl: {
    type: String,
  }
});

const emit = defineEmits(['choose']);

const onChoose = () => emit('choose');

const onAddToOrder = (event) => {
  event.stopPropagation();

  const rawOrderData = window.localStorage.getItem('order');
  const selectedTables = window.localStorage.getItem('selectedTables');

  try {
    let order = null;

    if (rawOrderData) {
      order = JSON.parse(rawOrderData);
    } else {
      order = {
        tables: [ ...JSON.parse(selectedTables) ],
      };
    }

    console.log(order);
  } catch (error) {
    console.log('Ошибка добавления в заказа', error);
  }
}

</script>
