<template>
  <div
    class="relative flex flex-col h-[350px] w-[calc(50%-40px)] md:w-[calc(33%-40px)] xl:w-[calc(25%-40px)] box-border rounded-[19px] menu-card-bg mr-[40px] mb-[40px] shrink-0 pointer-events-auto default-transition animated-long"
    :class="{ 'active-menu-card border-animation': isProductInOrder }"
    @click="onChoose"
    v-if="isCardReady"
    ref="cardElement"
  >
    <div class="relative h-[145px] w-full shrink-0">
      <div
        class="absolute w-[183px] h-[183px] top-[-30px] left-[-25px] overflow-hidden rounded-[100px] animated"
      >
        <img
          class="inner-img"
          :src="product.imageLinks[0] || '/images/ImageBasicDish.png'"
          @load="onImageLoad"
          ref="cardImage"
          alt=""
        />
      </div>
      <div class="absolute w-[5px] h-auto top-[11px] right-[13px]">
        <img src="/icons/IconThreeDots.svg" alt="" />
      </div>
    </div>
    <div class="h-full w-full box-border p-[17px] flex flex-col justify-between">
      <span
        ref="productName"
        class="font-Segoe font-semibold text-[16px] leading-[150%] tracking-[0.12em] uppercase text-[#000] clip-5"
      >
        {{ product.name }}
      </span>
      <span
        class="font-Segoe font-[350] text-[14px] leading-[136%] text-darkBlue clip-4"
        v-if="!isDescrHidden"
      >
        {{ description }}
      </span>
      <span class="font-Segoe font-bold text-[20px] leading-[115%] tracking-[0.03em] text-darkBlue">
        {{ product.sizePrices[0].price.currentPrice }} Руб.
      </span>
      <Transition name="expand">
        <Counter
          v-if="isProductInOrder"
          isBlack
          class="pointer-events-auto"
          :quantity="product?.selected?.amount"
          @update="onProductCounterUpdate"
          @empty="onDeleteFromOrder"
        />
        <IconPlus
          ref="iconPlus"
          v-else-if="!isProductInOrder"
          :isBlack="true"
          @click="onAddToOrder"
        />
      </Transition>
    </div>
  </div>
  <div
    class="relative flex flex-col h-[350px] w-[calc(50%-40px)] md:w-[calc(33%-40px)] xl:w-[calc(25%-40px)] box-border rounded-[19px] menu-card-bg mr-[40px] mb-[40px] shrink-0 pointer-events-auto default-transition animated-long"
    v-else-if="!isCardReady"
    ref="cardElement"
  >
    <div class="relative h-[145px] w-full shrink-0">
      <div
        class="absolute w-[183px] h-[183px] top-[-30px] left-[-25px] overflow-hidden flex rounded-full bg-[#fff]"
      ></div>
    </div>
    <div class="h-full w-full box-border p-[17px] flex flex-col justify-between">
      <div class="flex flex-col">
        <div class="w-[50%] h-[15px] bg-darkBlue opacity-20 rounded-full"></div>
        <div class="w-[30%] h-[15px] bg-darkBlue opacity-20 rounded-full mt-[10px]"></div>
      </div>
      <div class="w-[30%] h-[15px] bg-darkBlue opacity-20 rounded-full"></div>
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { ref, defineEmits, defineProps, onMounted, onBeforeUnmount } from 'vue'
import { IconPlus, Counter } from '@/components'

const isImageLoaded = ref(false)
const isCardReady = ref(false)

const onImageLoad = () => {
  isImageLoaded.value = true
  checkCardReady()
}

const props = defineProps({
  product: {
    type: Object
  }
})

const emit = defineEmits(['choose', 'order-update'])

const isProductInOrder = ref(props.product.selected)

const onChoose = () => emit('choose', props.product)

const isDescrHidden = ref(false)
const productName = ref(null)
const description =
  props.product.description ||
  'Lorem Ipsum является текст-заполнитель обычно используется в графических, печать и издательской индустрии для предварительного просмотра макета и визуальных макетах.'

const cardElement = ref(null)

const handleVisibilityChange = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && isImageLoaded) {
      checkCardReady()
      setTimeout(() => {
        isCardReady.value = true
      }, 250)
    }
  })
}

let observer = null

onMounted(() => {
  observer = new IntersectionObserver(handleVisibilityChange, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  })

  if (cardElement.value) {
    observer.observe(cardElement.value)
  }
})

onBeforeUnmount(() => {
  if (observer && cardElement.value) {
    observer.unobserve(cardElement.value)
  }
})

const checkCardReady = () => {
  if (isImageLoaded.value && cardElement.value) {
    isCardReady.value = true
    if (productName.value && productName.value.clientHeight > 48) {
      isDescrHidden.value = true
    }
  }
}

const onAddToOrder = (event, amount = 1) => {
  event && event.stopPropagation()

  const rawOrderData = window.localStorage.getItem('order')
  const selectedTables = window.localStorage.getItem('selectedTables')

  try {
    let order = null

    if (rawOrderData) {
      order = JSON.parse(rawOrderData)
      const product = order.products.find((p) => p.id === props.product.id)

      if (product) {
        product.amount = amount
      } else {
        order.products.push({ ...props.product, amount })
      }
    } else {
      order = {
        tables: [...JSON.parse(selectedTables)],
        products: [{ ...props.product, amount }]
      }
    }

    isProductInOrder.value = true
    window.localStorage.setItem('order', JSON.stringify(order))

    emit('order-update')
  } catch (error) {
    console.log('Ошибка добавления в заказа', error)
  }
}

const onDeleteFromOrder = () => {
  const rawOrderData = window.localStorage.getItem('order')

  try {
    let order = JSON.parse(rawOrderData)
    order.products = order.products.filter((p) => p.id !== props.product.id)
    isProductInOrder.value = false
    window.localStorage.setItem('order', JSON.stringify(order))
    emit('order-update')
  } catch (error) {
    console.log('Ошибка удаления из заказа', error)
  }
}

const onProductCounterUpdate = (amount) => {
  onAddToOrder(null, amount.value)
}
</script>

<!----------------- BACKUP PAGE WITHOUT INTERSECT API ------------------->

<!-- <template>
  <div
    class="relative flex flex-col h-[350px] w-[calc(50%-40px)] md:w-[calc(33%-40px)] xl:w-[calc(25%-40px)] box-border rounded-[19px] menu-card-bg mr-[40px] mb-[40px] shrink-0 pointer-events-auto default-transition"
    :class="{ 'active-menu-card border-animation': isProductInOrder }"
    @click="onChoose"
    v-if="isCardReady"
  >
    <div class="relative h-[145px] w-full shrink-0">
      <div
        class="absolute w-[183px] h-[183px] top-[-30px] left-[-25px] overflow-hidden rounded-[100px]"
      >
        <img
          class="inner-img"
          :src="product.imageLinks[0] || '/images/ImageBasicDish.png'"
          @load="onImageLoad"
          alt=""
        />
      </div>
      <div class="absolute w-[5px] h-auto top-[11px] right-[13px]">
        <img src="/icons/IconThreeDots.svg" alt="" />
      </div>
    </div>
    <div class="h-full w-full box-border p-[17px] flex flex-col justify-between">
      <span
        ref="productName"
        class="font-Segoe font-semibold text-[16px] leading-[150%] tracking-[0.12em] uppercase text-[#000] clip-5"
      >
        {{ product.name }}
      </span>
      <span
        class="font-Segoe font-[350] text-[14px] leading-[136%] text-darkBlue clip-4"
        v-if="!isDescrHidden"
      >
        {{ description }}
      </span>
      <span class="font-Segoe font-bold text-[20px] leading-[115%] tracking-[0.03em] text-darkBlue">
        {{ product.sizePrices[0].price.currentPrice }} Руб.
      </span>
      <Transition name="expand">
        <Counter
          v-if="isProductInOrder"
          isBlack
          class="pointer-events-auto"
          :quantity="product?.selected?.amount"
          @update="onProductCounterUpdate"
          @empty="onDeleteFromOrder"
        />
        <IconPlus
          ref="iconPlus"
          v-else-if="!isProductInOrder"
          :isBlack="true"
          @click="onAddToOrder"
        />
      </Transition>
    </div>
  </div>
  <div
    class="relative flex flex-col h-[350px] w-[calc(50%-40px)] md:w-[calc(33%-40px)] xl:w-[calc(25%-40px)] box-border rounded-[19px] menu-card-bg mr-[40px] mb-[40px] shrink-0 pointer-events-auto default-transition animated-up"
    v-else-if="!isCardReady"
    ref="target"
  >
    <div class="relative h-[145px] w-full shrink-0">
      <div
        class="absolute w-[183px] h-[183px] top-[-30px] left-[-25px] overflow-hidden flex rounded-full bg-[#fff]"
      ></div>
    </div>
    <div class="h-full w-full box-border p-[17px] flex flex-col justify-between">
      <div class="flex flex-col">
        <div class="w-[50%] h-[15px] bg-darkBlue opacity-20 rounded-full"></div>
        <div class="w-[30%] h-[15px] bg-darkBlue opacity-20 rounded-full mt-[10px]"></div>
      </div>
      <div class="w-[30%] h-[15px] bg-darkBlue opacity-20 rounded-full"></div>
    </div>
  </div>
</template> -->

<!-- <script setup>
import { ref, defineEmits, defineProps, onMounted } from 'vue'
import { IconPlus, Counter } from '@/components'

const isImageLoaded = ref(false)
const isCardReady = ref(false)

const onImageLoad = () => {
  isImageLoaded.value = true
}

const props = defineProps({
  product: {
    type: Object
  }
})

const emit = defineEmits(['choose', 'order-update'])

const isProductInOrder = ref(props.product.selected)

const onChoose = () => emit('choose', props.product)

const isDescrHidden = ref(false)
// const isImageLoaded = ref(false)
const productName = ref(null)
const description =
  props.product.description ||
  'Lorem Ipsum является текст-заполнитель обычно используется в графических, печать и издательской индустрии для предварительного просмотра макета и визуальных макетах.'

onMounted(() => {
  console.log(targetIsVisible.value)
  if (targetIsVisible.value && isImageLoaded.value) {
    isCardReady.value = true
    console.log('sdsdsdsd')
  }
  if (isCardReady.value) {
    if (productName.value.clientHeight > 48) {
      isDescrHidden.value = true
    }
  }
})

const onAddToOrder = (event, amount = 1) => {
  event && event.stopPropagation()

  const rawOrderData = window.localStorage.getItem('order')
  const selectedTables = window.localStorage.getItem('selectedTables')

  try {
    let order = null

    if (rawOrderData) {
      order = JSON.parse(rawOrderData)
      const product = order.products.find((p) => p.id === props.product.id)

      if (product) {
        product.amount = amount
      } else {
        order.products.push({ ...props.product, amount })
      }
    } else {
      order = {
        tables: [...JSON.parse(selectedTables)],
        products: [{ ...props.product, amount }]
      }
    }

    isProductInOrder.value = true
    window.localStorage.setItem('order', JSON.stringify(order))

    emit('order-update')
  } catch (error) {
    console.log('Ошибка добавления в заказа', error)
  }
}

const onDeleteFromOrder = () => {
  const rawOrderData = window.localStorage.getItem('order')

  try {
    let order = JSON.parse(rawOrderData)
    order.products = order.products.filter((p) => p.id !== props.product.id)
    isProductInOrder.value = false
    window.localStorage.setItem('order', JSON.stringify(order))
    emit('order-update')
  } catch (error) {
    console.log('Ошибка удаления из заказа', error)
  }
}

const onProductCounterUpdate = (amount) => {
  onAddToOrder(null, amount.value)
}
</script> -->
