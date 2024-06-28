<template>
  <div
    class="relative flex flex-col h-[320px] w-[calc(50%-40px)] md:w-[calc(33%-40px)] xl:w-[calc(25%-40px)] box-border rounded-[19px] menu-card-bg mr-[40px] mb-[40px] shrink-0 pointer-events-auto default-transition animated"
    :class="{ 'active-menu-card border-animation': isProductInOrder}"
    ref="cardElement"
    @click="updateBusinessOrder"
  >
    <div class="relative h-[145px] w-full shrink-0">
      <div
        class="absolute overflow-hidden rounded-[100px] animated flex justify-center items-center"
        :class="
          imgSrc !== '/icons/IconCancel.svg'
            ? 'w-[183px] h-[183px] top-[-30px] left-[-25px]'
            : 'top-0 left-0 w-[130px] h-[130px]'
        "
      >
        <img class="inner-img animated" :src="imgSrc||'/images/ImageBasicDish.png'" ref="cardImage" alt="" />
      </div>
    </div>
    <div class="h-full w-full box-border p-[17px] flex flex-col justify-between">
      <div class="relative flex flex-col">
        <span
          ref="productName"
          class="font-Segoe font-semibold text-[16px] leading-[150%] tracking-[0.12em] uppercase text-[#000] clip-5 mb-[5px]"
        >
          {{ title }}
        </span>
        <span
          class="font-Segoe font-[350] text-[14px] leading-[136%] text-darkBlue clip-4"
          v-if="!isDescrHidden"
        >
          {{ description }}
        </span>
      </div>
      <div v-if="isCurrentDaySelected">
        <Transition name="expand">
          <IconPlus
            ref="iconPlus"
            v-if="!isProductInOrder"
            :isBlack="true"
            @click="onAddToOrder"
          />
          <Counter
            v-else-if="isProductInOrder==true"
            isBlack
            class="pointer-events-auto"
            :quantity="productAmount"
            @update="onProductCounterUpdate"
          />
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { IconPlus, Counter } from '@/components'
import { useBusinessStore } from '@/stores/business.store';

const props = defineProps({
  product: {
    type: Object
  },
  subGroupIndex: {
    type: Number
  },
  productIndex: {
    type: Number
  },
  imgSrc: {
    type: String
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  isCurrentDaySelected: {
    type: Boolean
  },
  day: {
    type: Number
  },
  isCardEmpty: {
    type: Boolean
  }
})

const title = ref(null)
const businessStore = useBusinessStore()
const cardElement = ref(null)
const productName = ref(null)
const isDescrHidden = ref(false)
const isProductInOrder = ref(null)
const productAmount = ref(0)

if (!props.isCardEmpty && props.isCurrentDaySelected) {
  isProductInOrder.value=false
}

if (props.name.includes("ДО ")) {
  title.value = props.name.replace("ДО ", "")
} else {
  title.value = props.name
}

const onAddToOrder = () => {
  businessStore.businessOrder.push(props.product) 
  businessStore.businessProducts.subGroups[props.product.subGroupIndex].products[props.product.productIndex].amount+=1
  businessStore.finalCost+=props.product.sizePrices[0].price.currentPrice
}

onMounted(() => {
  if (cardElement.value) {
    if (productName.value && productName.value.clientHeight > 48) {
      isDescrHidden.value = true
    }
  }
})
</script>
