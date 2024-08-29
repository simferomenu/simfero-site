<template>
  <div
    class="relative w-[312px] !h-screen bg-darkBlue flex flex-col box-border py-[30px] px-[20px] shrink-0 border-r-gold border-solid border-r-[2px] default-transition pointer-events-none overflow-hidden"
  >
    <div
      class="relative w-full flex items-center h-[71px] animated-down"
      @mousedown="startTimer"
      @mouseup="clearTimer"
      @mouseleave="clearTimer"
      @touchstart="startTimer"
      @touchend="clearTimer"
      @touchcancel="clearTimer"
    >
      <img class="h-full w-auto" src="/icons/IconLogo.png" alt="" />
      <div class="relative flex flex-col ml-[15px]">
        <h1
          class="font-Sitka font-normal text-[36px] leading-[96%] tracking-[0.09em] uppercase text-gold pointer-events-auto"
        >
          SIMFERO
        </h1>
        <span class="font-Sitka font-normal text-[14px] text-gold tracking-[0.07em]"
          >панорамный ресторан</span
        >
      </div>
    </div>
    <div
      class="relative w-full flex-1 h-full flex flex-col mt-[30px] !overflow-auto pointer-events-auto custom-scrollbar animated-up"
    >
      <ul class="box-border pb-[20px]">
        <li v-for="(item, selectedGroupIndex) in categories" :key="item.name">
          <div
            :class="[
              'menu-link accordion',
              {
                active: activeGroupIndex === selectedGroupIndex
              }
            ]"
            @click="onGroupSelect(selectedGroupIndex)"
          >
            {{ item.name }}
          </div>

          <div class="panel [&>*:not(:last-child)]:mb-[10px]">
            <div
              class="panel-link"
              v-for="(sub, selectedSubGroupIndex) in item.subGroups"
              :key="sub.id"
            >
              <img class="h-[24px] w-[24px] mr-[10px]" src="/icons/IconCircleArrow.svg" alt="" />
              <div
                class="font-Sitka text-[#fff] text-[15px] tracking-[0.17em] uppercase leading-[160%] font-normal"
                @click="onSubGroupSelect(selectedSubGroupIndex)"
              >
                {{ sub.name }}
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div
      class="relative w-full flex flex-col pt-[30px] [&>*:not(:last-child)]:mb-[30px] animated-up"
    >
      <div class="absolute left-0 top-0 w-[312px] translate-x-[-20px] h-[150%] bg-[#27282b]"></div>
      <div class="relative flex items-center !pointer-events-auto" @click="onBusinessClick">
        <img class="w-[32px] h-[32px]" src="/icons/IconBriefcaseGold.svg" alt="" />
        <span class="menu-link ml-[15px]" :class="{ active: businessStore.isBusinessVisible }"
          >Деловые обеды (11:00-16:00)</span
        >
      </div>
      <!-- <div class="relative flex items-center !pointer-events-auto">
        <img class="w-[32px] h-[32px]" src="/icons/IconExclamation.svg" alt="" />
        <span class="menu-link ml-[15px]">Интерактивы</span>
      </div> -->
      <div class="relative flex items-center ml-[50px]" v-if="productsStore.orderFunc == true">
        <span
          @click="$emit('openOrder')"
          class="menu-link !pointer-events-auto shrink-0 text-nowrap"
          >Мой заказ</span
        >
        <Transition name="fade">
          <SmallCounter v-if="orderAmount" :value="orderAmount" />
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  max-height: 0px;
  transition: max-height 0.2s ease-out;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 20px;
}

.panel-link {
  @apply relative flex;
}
</style>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { SmallCounter } from '@/components'
import { useOrderStore } from '@/stores/order.store'
import { useBusinessStore } from '@/stores/business.store'
import { useProductsStore } from '@/stores/products.store'

const businessStore = useBusinessStore()
const productsStore = useProductsStore()

const props = defineProps({
  categories: {
    type: Array
  }
})

const pressTimer = ref(null)

const startTimer = () => {
  pressTimer.value = setTimeout(() => {
    toWaiterView()
  }, 4000)
}

const clearTimer = () => {
  if (pressTimer.value) {
    clearTimeout(pressTimer.value)
    pressTimer.value = null
  }
}

const emit = defineEmits(['select', 'selectGroup', 'selectSubGroup'])
const router = useRouter()
const activeGroupIndex = ref()
const acc = document.getElementsByClassName('accordion')

const onGroupSelect = (selectedGroupIndex) => {
  businessStore.isBusinessVisible = false
  emit('selectGroup', { selectedGroupIndex })
  activeGroupIndex.value = selectedGroupIndex
  for (let i = 0; i < acc.length; i++) {
    acc[i].nextElementSibling.style.maxHeight = 0
    acc[i].classList.remove('active')
  }

  const clickedAcc = event.target.closest('.accordion')
  if (clickedAcc) {
    clickedAcc.classList.add('active')
    if (props.categories[selectedGroupIndex].subGroups.length > 1) {
      clickedAcc.nextElementSibling.style.maxHeight =
        clickedAcc.nextElementSibling.scrollHeight + 'px'
    }
  }
}
const onSubGroupSelect = (selectedSubGroupIndex) => {
  emit('selectSubGroup', { selectedSubGroupIndex })
}

const selectFirstAcc = () => {
  for (let i = 0; i < acc.length; i++) {
    acc[0].click()
  }
}

const orderStore = useOrderStore()

const toWaiterView = () => {
  window.localStorage.removeItem('selectedTables')
  orderStore.order = []
  orderStore.preOrder = []
  orderStore.orderInfo = {
    orderId: null,
    orderAmount: 0
  }
  router.push('/waiter')
}

const orderAmount = computed(() => orderStore.orderInfo.orderAmount)

onMounted(() => {
  const rawOrderData = window.localStorage.getItem('order')

  try {
    if (rawOrderData) {
      const order = JSON.parse(rawOrderData)
    }
  } catch (error) {
    console.log('Ошибка получение состояния корзины', error)
  }
  setTimeout(selectFirstAcc, 100)
})

const onBusinessClick = () => {
  activeGroupIndex.value = null
  businessStore.isBusinessVisible = true
  for (let i = 0; i < acc.length; i++) {
    acc[i].nextElementSibling.style.maxHeight = 0
    acc[i].classList.remove('active')
  }
}
</script>
