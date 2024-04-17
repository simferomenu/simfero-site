<template>
  <div
    :class="
      isBlack
        ? 'flex items-center box-border px-[8px] py-[12px] w-fit h-[45px] bg-darkBlue rounded-tl-[33px] rounded-tr-[33px] rounded-br-[33px] absolute right-[-10px] bottom-0 z-[3] pointer-events-none'
        : 'flex items-center box-border px-[8px] py-[12px] w-fit h-[45px] bg-gold rounded-tl-[33px] rounded-tr-[33px] rounded-br-[33px] absolute right-[-10px] bottom-0 z-[3] pointer-events-none'
    "
  >
    <div
      class="flex justify-center items-center h-full w-auto !pointer-events-auto"
      @click="onQuantityChange($event,-1)"
    >
      <img v-if="isBlack" src="/icons/IconMinusGold.svg" alt="" />
      <img v-if="!isBlack" src="/icons/IconMinusBlack.svg" alt="" />
    </div>
    <div
      :class="
        isBlack
          ? 'font-Segoe font-semibold text-[18px] tracking-[0.15em] uppercase text-gold text-center mx-[15px]'
          : 'font-Segoe font-semibold text-[18px] tracking-[0.15em] uppercase text-[#000] text-center mx-[15px]'
      "
    >
      {{ counterValue }}
    </div>
    <div
      class="flex justify-center items-center h-full w-auto !pointer-events-auto"
      @click="onQuantityChange($event, 1)"
    >
      <img v-if="!isBlack" src="/icons/IconPlusBlack.svg" alt="" />
      <img v-if="isBlack" src="/icons/IconPlusGold.svg" alt="" />
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  quantity: Number,
  isBlack: Boolean
});
const emit = defineEmits(['update']);

const counterValue = ref(props.quantity);

const onQuantityChange = (event, iterator) => {
  event.stopPropagation();

  counterValue.value += iterator;

  emit('update', counterValue);
}

</script>
