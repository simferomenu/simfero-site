<template>
  <div
    class="relative w-[280px] h-[64px] flex justify-between items-center py-[20px] px-[15px] box-border rounded-tl-[33px] rounded-tr-[33px] rounded-br-[33px] border-solid border-[2px] border-transparent bg-gold"
  >
    <span
      class="font-Segoe font-semibold text-[16px] leading-[237%] tracking-[0.17em] uppercase text-darkBlue"
      >Добавить</span
    >
    <img class="h-full w-auto" src="/icons/IconPlusBlack.svg" alt="" />
  </div>
</template>

<style scoped></style>

<script setup>
import { ref, defineEmits, defineProps, onMounted, computed } from 'vue'
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

const isActive = ref(props.isActive)
const counter = computed(() => {
  return props.quantity
})

const activateDishButton = () => {
  isActive.value = true
  emit('selected')
}

const onQuantityChange = (event, iterator) => {
  event.stopPropagation()

  counter.value += iterator
  emit('update', iterator)
}
</script>
