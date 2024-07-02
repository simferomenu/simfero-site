<template>
  <div
    class="relative w-[280px] h-[64px] flex justify-between items-center py-[20px] px-[15px] box-border rounded-tl-[33px] rounded-tr-[33px] rounded-br-[33px] border-solid border-[2px] border-transparent !border-gold bg-transparent"
  >
    <span
      class="font-Segoe font-semibold text-[16px] leading-[237%] tracking-[0.17em] uppercase text-gold"
      >Добавить</span
    >
    <div class="relative flex items-center justify-center">
      <div class="relative box-border px-[5px]">
        <img
          class="h-full w-auto"
          src="/icons/IconMinusGold.svg"
          alt=""
          @click="onQuantityChange(-1)"
        />
      </div>
      <div
        class="font-Segoe font-semibold text-[23px] leading-[165%] tracking-[0.12em] uppercase text-center text-gold mx-[20px]"
      >
        {{ counter }}
      </div>
      <div class="relative box-border px-[5px]">
        <img
          class="h-full w-auto"
          src="/icons/IconPlusGold.svg"
          alt=""
          @click="onQuantityChange(1)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { useProductsStore } from '@/stores/products.store';
import { ref } from 'vue'
import { useBusinessStore } from '@/stores/business.store';
const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  },
  cardInfo: {
    type: Object
  }
})

const productsStore = useProductsStore()
const businessStore = useBusinessStore()
const counter = ref(null)

if (props.cardInfo.groupIndex!=null) {
  counter.value = (productsStore.productsList[props.cardInfo.groupIndex].subGroups[props.cardInfo.subGroupIndex].products[props.cardInfo.cardIndex].amount)
} else {
  counter.value = (businessStore.businessProducts.subGroups[props.cardInfo.subGroupIndex].daysOfWeek[props.cardInfo.dayIndex][props.cardInfo.cardIndex].amount)
}

const emit = defineEmits(['update'])

const onQuantityChange = (iterator) => {
  counter.value += iterator
  emit('update', iterator)
}
</script>
