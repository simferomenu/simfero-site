<template>
  <div
    class="flex items-center box-border px-[8px] py-[12px] w-fit h-[45px] bg-gold rounded-tl-[33px] rounded-tr-[33px] rounded-br-[33px] absolute right-0 bottom-0 z-[3] pointer-events-none"
  >
    <div
      class="flex justify-center items-center h-full w-auto !pointer-events-auto"
      @click="onQuantityChange($event,-1)"
    >
      <img src="/icons/IconMinus.svg" alt="" />
    </div>
    <div
      class="font-Segoe font-semibold text-[18px] tracking-[0.15em] uppercase text-[#000] text-center mx-[15px]"
    >
      {{ counterValue }}
    </div>
    <div
      class="flex justify-center items-center h-full w-auto !pointer-events-auto"
      @click="onQuantityChange($event, 1)"
    >
      <img src="/icons/IconPlusBlack.svg" alt="" />
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  quantity: Number
});
const emit = defineEmits(['update']);

const counterValue = ref(props.quantity);

const onQuantityChange = (event, iterator) => {
  event.stopPropagation();

  counterValue.value += iterator;

  emit('update', counterValue);
}
</script>
