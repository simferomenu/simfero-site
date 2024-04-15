<template>
  <div
    ref='cell'
    :class="[
      'w-[100px] h-[44px] flex justify-center items-center font-bold text-[16px] tracking-[0.17em] uppercase text-center text-[#fff] mr-[20px] mb-[30px]',
      {
        'opacity-50': disabled,
        'border-solid border-b-[1px] border-b-[#fff]': !disabled,
        'active-cell': isActive
      }
    ]"
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
  isSelected: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['selected'])
const cell = ref();
const isActive = ref(props.isSelected);

const activateCell = () => {
  isActive.value = !isActive.value;
  emit('selected', { id: props.id });
}
</script>

<style scoped></style>
