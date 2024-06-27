<template>
  <div
    class="relative flex flex-col shrink-1 w-full h-screen overflow-x-hidden box-border main-bg py-[40px] pl-[37px] pointer-events-auto"
  >
  <span
        class="font-normal text-[#000] uppercase text-[25px] leading-[117%] tracking-[0.11em] font-Sitka mr-[14px] block shrink-0 w-fit py-[40px] text-[36px] "
      >
        ДЕЛОВЫЕ ОБЕДЫ
      </span>
    <!-- <div class="relative pr-[37px] mb-[55px]">
      <div
        class="relative w-full flex flex-col border-solid border-y-[2px] border-y-gold box-border p-[16px]"
      >
        <div class="relative flex justify-between">
          <div class="relative w-fit shrink-0 mr-[40px]">
            <img src="/icons/IconBriefcaseBlack.svg" class="w-[43px] h-[43px] text-[25px]" alt="" />
          </div>
          <div
            class="relative w-full mt-[14px] font-[350] text-[14px] leading-[120%] text-darkBlue"
          >
            В зависимости от дня недели тут будет будет можно выбрать разные блюда. Сегодня вторник
            :)
          </div>
        </div>
      </div>
    </div> -->
    <div class="flex flex-row gap-[10px] pb-[40px]">
      <button class="rounded-[21px] px-[20px] pt-[7px] pb-[10px] text-[14px] font-[350]" :class="index==selectedDay?'bg-black text-white':'menu-card-bg text-black'
       " v-for="(day, index) in daysOfWeekArr.length" :key="index" @click="handleDaySelect(index)">{{ daysOfWeekArr[index] }}</button>
    </div>
    <BusinessLunchSection v-for="(subGroup, subGroupIndex) of businessStore.businessProducts.subGroups"
    :key="subGroup.id" 
    :subGroup="subGroup">
      <BusinessLunchCard v-for="(product, productIndex) of subGroup.daysOfWeek[selectedDay]"
        :key="product.id"
        :isCurrentDaySelected="isCurrentDaySelected"
        :subGroupIndex="subGroupIndex"
        :productIndex="productIndex"
        :product="product"
        :name="product.name"
        :description="product.description"
        :day="currentDay"
        :imgSrc="product.imageLinks[0]"
      />
      <BusinessLunchCard
        :name="'Не выбирать'"
        :subGroupIndex="subGroupIndex"
        :imgSrc="'/icons/IconCancel.svg'"
      />
    </BusinessLunchSection>
    <!-- <BusinessLunchSection :name="'Выберите первое блюдо (+200 руб)'" /> -->
    <!-- <div class="relative w-full mb-[55px]">
      <span
        class="font-semibold text-[#000] uppercase text-[25px] leading-[117%] tracking-[0.11em] font-Sitka"
      >
        Выберите второе блюдо <span>(+300 руб)</span>
      </span>
    </div>
    <div class="relative w-full flex flex-wrap">
      <BusinessLunchCard
        :name="'Маки Ролл с угрем'"
        :description="'Блюдо японской кухни, которое представляет собой небольшой рулет из риса, водорослей нори.'"
        :img-src="'https://mig.pics/x/uploads/posts/2022-09/thumbs/1663763551_58-mykaleidoscope-ru-p-avtorskie-rolli-yeda-pinterest-67.jpg'"
      />
      <BusinessLunchCard
        :name="'Стейк из тунца'"
        :description="'Тунец имеет плотную текстуру и насыщенный вкус, что делает его идеальным для стейков.'"
        :img-src="'https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_656b1d8105476c49d82b00c8_656b1ec26b9cdf31c05f2063/scale_1200'"
      />
    </div> -->
    <!-- <div class="relative w-full mb-[30px]">
      <span
        class="font-semibold text-[#000] uppercase text-[25px] leading-[117%] tracking-[0.11em] font-Sitka"
        >Дополнительно</span
      >
    </div>
    <div class="relative w-full flex flex-wrap mb-[55px] [&>*:not(:last-child)]:mr-[10px]">
      <div
        class="relative w-fit box-border py-[7px] px-[20px] menu-card-bg h-[37px] rounded-[21px] font-Segoe font-[350] text-[14px] uppercase text-darkBlue"
      >
        Хлебная тарелка
      </div>
      <div
        class="relative w-fit box-border py-[7px] px-[20px] menu-card-bg h-[37px] rounded-[21px] font-Segoe font-[350] text-[14px] uppercase text-darkBlue"
      >
        Красные
      </div>
      <div
        class="relative w-fit box-border py-[7px] px-[20px] menu-card-bg h-[37px] rounded-[21px] font-Segoe font-[350] text-[14px] uppercase text-darkBlue"
      >
        Сладкие
      </div>
      <div
        class="relative w-fit box-border py-[7px] px-[20px] menu-card-bg h-[37px] rounded-[21px] font-Segoe font-[350] text-[14px] uppercase text-darkBlue"
      >
        Полусладкие
      </div>
    </div> -->
    <div
      class="relative w-full flex justify-between items-center border-solid border-t-[1px] border-t-darkBlue min-h-[60px] box-border pr-[37px] pt-[15px] mt-[15px] mb-[55px] z-[4] animated-up"
    >
      <div class="flex items-center">
        <span class="font-Segoe font-[350] text-[26px] tracking-[0.03em] text-darkBlue"
          >Сумма заказа:</span
        >
        <span class="font-Segoe font-bold text-[26px] tracking-[0.03em] text-darkBlue ml-[30px]"
          >{{ orderCost }}</span
        >
      </div>
      <div class="flex flex-col h-fit !pointer-events-auto">
        <span
          @click="onMakeOrder"
          class="font-Segoe font-semibold text-[20px] tracking-[0.13em] uppercase text-darkBlue"
        >
          Добавить в корзину
        </span>
        <div class="absolute bottom-[-10px] right-[-270px] w-[600px] flex shrink-1 items-center">
          <img class="block h-[15px] w-auto" src="/icons/IconRhombusBlack.svg" alt="" />
          <div class="h-[1px] w-full bg-darkBlue"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { BusinessLunchCard, BusinessLunchSection, MenuSection } from '@/components'
import { ref, computed } from 'vue';
import { useBusinessStore } from '@/stores/business.store';
import { useOrderStore } from '@/stores/order.store';

const orderStore = useOrderStore()
const selectedDay = ref((new Date().getDay())-1)
const orderCost = ref(0)
const currentDay = (new Date().getDay())-1
const isCurrentDaySelected = ref(true)
const checkItemOrderExist = ref([])

const businessStore = useBusinessStore()

const handleDaySelect = (dayIndex) => {
  selectedDay.value = dayIndex
}

const daysOfWeekArr = ref(['ПОНЕДЕЛЬНИК', 'ВТОРНИК', 'СРЕДА', 'ЧЕТВЕРГ', 'ПЯТНИЦА'])
daysOfWeekArr.value[currentDay]="СЕГОДНЯ"

// for (const subGroup of businessStore.businessProducts.subGroups) {
//   for (const product of subGroup.daysOfWeek[selectedDay.value]) {
    
//   }
// }

isCurrentDaySelected.value = computed(() => {
  if (selectedDay.value == currentDay) {
    return true
  } else {
    return false
  }
})

businessStore.$subscribe(() => {
  orderCost.value = 0
  for (const orderItem of businessStore.businessOrder) {
    if (orderItem.product!=null) {
      orderCost.value+=orderItem.product.sizePrices[0].price.currentPrice
    }
  }
})

const onMakeOrder = () => {
  for (const orderItem of businessStore.businessOrder) {
    // if (orderItem.product!=null && orderStore.order.filter((product) => product.id==orderItem.product.id).length==0 && orderStore.order.filter((product) => product.parentGroup==orderItem.product.parentGroup).length==0) {
    //   orderItem.product.amount=1
    //   orderStore.orderInfo.orderAmount+=1
    //   orderStore.order.push(orderItem.product)
    //   orderItem.product=null
    // } else {
    //   orderItem.product=null
    // }
      orderItem.product.amount+=1
      orderStore.orderInfo.orderAmount+=1
      orderStore.order.push(orderItem.product)
      orderItem.product=null
  }
}

</script>
