<template>
  <div
    class="relative w-[280px] h-[64px] flex justify-between items-center py-[20px] px-[15px] box-border rounded-tl-[33px] rounded-tr-[33px] rounded-br-[33px] border-solid border-[2px] border-transparent !border-gold bg-transparent"
  >
    <span
      class="font-Segoe font-semibold text-[16px] leading-[237%] tracking-[0.17em] uppercase text-gold"
      >Добавить</span
    >
    <div class="relative flex items-center justify-center">
      <img
        class="h-full w-auto"
        src="/icons/IconMinusGold.svg"
        alt=""
        @click="onQuantityChange(-1)"
      />
      <div
        class="font-Segoe font-semibold text-[23px] leading-[165%] tracking-[0.12em] uppercase text-center text-gold mx-[20px]"
      >
        {{ counter }}
      </div>
      <img
        class="h-full w-auto"
        src="/icons/IconPlusGold.svg"
        alt=""
        @click="onQuantityChange(1)"
      />
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { defineEmits, defineProps, computed } from 'vue'
const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  },
  quantity: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['update'])

const counter = computed(() => {
  return props.quantity
})


const onQuantityChange = (iterator) => {

  counter.value += iterator
  emit('update', iterator)
}
</script>
