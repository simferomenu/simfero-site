<template>
  <div
    class="relative w-[280px] h-[64px] flex justify-between items-center py-[20px] px-[15px] box-border rounded-tl-[33px] rounded-tr-[33px] rounded-br-[33px] border-solid border-[2px] border-transparent"
    :class="!isActive ? 'bg-gold' : '!border-gold bg-transparent'"
    @click="activateDishButton"
  >
    <span
      class="font-Segoe font-semibold text-[16px] leading-[237%] tracking-[0.17em] uppercase"
      :class="!isActive ? 'text-[#000]' : 'text-gold'"
      >Добавить</span
    >
    <Transition name="fade">
      <img v-if="!isActive" class="h-full w-auto" src="/icons/IconPlusBlack.svg" alt="" />
      <div v-else-if="isActive" class="relative flex items-center justify-center">
        <img
          class="h-full w-auto"
          src="/icons/IconMinusGold.svg"
          alt=""
          @click="onQuantityChange($event, -1)"
        />
        <div
          class="font-Segoe font-semibold text-[23px] leading-[165%] tracking-[0.12em] uppercase text-center text-gold mx-[20px]"
        >
          {{ quantity }}
        </div>
        <img
          class="h-full w-auto"
          src="/icons/IconPlusGold.svg"
          alt=""
          @click="onQuantityChange($event, 1)"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped></style>

<script setup>
import { ref, defineEmits, defineProps, onMounted } from 'vue'
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

const activateDishButton = () => {
  isActive.value = true
  emit('selected')
}

const counterValue = ref(props.quantity)

const onQuantityChange = (event, iterator) => {
  event.stopPropagation()

  console.log('tap')

  counterValue.value += iterator

  if (counterValue.value <= 0) {
    counterValue.value = 1
    emit('empty')
  } else {
    emit('update', counterValue)
  }
}

onMounted(() => {
  console.log(counterValue.value)
})
</script>
