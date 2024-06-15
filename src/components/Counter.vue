<template>
  <div
    :class="
      isBlack
        ? 'flex items-center box-border px-[8px] py-[12px] w-fit h-[45px] bg-darkBlue rounded-tl-[33px] rounded-tr-[33px] rounded-br-[33px] absolute right-[-10px] bottom-0 z-[3] pointer-events-none'
        : 'flex items-center box-border px-[8px] py-[12px] w-fit h-[45px] bg-gold rounded-tl-[33px] rounded-tr-[33px] rounded-br-[33px] absolute right-[-10px] bottom-0 z-[3] pointer-events-none'
    "
  >
    <div
      class="flex justify-center items-center h-full w-auto !pointer-events-auto animated"
      @click="onQuantityChange(-1)"
    >
      <img v-if="isBlack" src="/icons/IconMinusGold.svg" alt="" class="shrink-0 w-[23px] h-auto" />
      <img
        v-if="!isBlack"
        src="/icons/IconMinusBlack.svg"
        alt=""
        class="shrink-0 w-[23px] h-auto"
      />
    </div>
    <div
      :class="
        isBlack
          ? 'font-Segoe font-semibold text-[18px] tracking-[0.15em] uppercase text-gold text-center mx-[15px] pointer-events-none'
          : 'font-Segoe font-semibold text-[18px] tracking-[0.15em] uppercase text-[#000] text-center mx-[15px] pointer-events-none'
      "
    >
      {{ counterValue }}
    </div>
    <div
      class="flex justify-center items-center h-full w-auto !pointer-events-auto animated"
      @click="onQuantityChange(1)"
    >
      <img v-if="!isBlack" src="/icons/IconPlusBlack.svg" alt="" class="shrink-0 w-[23px] h-auto" />
      <img v-if="isBlack" src="/icons/IconPlusGold.svg" alt="" class="shrink-0 w-[23px] h-auto" />
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  quantity: {
    type: Number,
  },
  isBlack: Boolean
})
const emit = defineEmits(['update'])

const counterValue = ref(props.quantity)

const onQuantityChange = (iterator) => {
  counterValue.value += iterator
  emit('update', iterator)
}
</script>
