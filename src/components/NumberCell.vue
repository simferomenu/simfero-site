<template>
  <div
    ref='cell'
    :class="
      !disabled
        ? 'w-[100px] h-[44px] flex justify-center items-center font-bold text-[16px] tracking-[0.17em] uppercase text-center text-[#fff] mr-[20px] mb-[30px] border-solid border-b-[1px] border-b-[#fff]'
        : 'w-[100px] h-[44px] flex justify-center items-center font-bold text-[16px] tracking-[0.17em] uppercase text-center text-[#fff] opacity-50 mr-[20px] mb-[30px]'
    "
    @click="activateCell"
  >
    {{ value }}
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const props = defineProps({
  active: {
    type: Boolean
  },
  disabled: {
    type: Boolean
  },
  value: {
    type: Number
  },
  id: {
    type: String
  },
});

const emit = defineEmits(['selected'])
const cell = ref();

const activateCell = () => {
  cell.value.classList.toggle('active-cell');
  emit('selected', { id: props.id });
}
</script>

<style scoped></style>
