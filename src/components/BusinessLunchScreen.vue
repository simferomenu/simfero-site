<template>
  <div
    class="relative flex flex-col shrink-1 w-full h-screen overflow-x-hidden box-border main-bg py-[40px] pl-[37px] pointer-events-auto"
  >
  <span
        class="font-normal text-[#000] uppercase text-[36px] leading-[117%] tracking-[0.11em] font-Sitka mr-[14px] block shrink-0 w-fit pb-[40px] pt-[20px]"
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
      <button class="rounded-[21px] px-[20px] pt-[10px] pb-[10px] text-[14px] font-[350] menu-card-bg" 
      :class="{
        'bg-black text-white font-semilight': index === selectedDay,
        'font-semibold ': index === currentDay
      }" 
      v-for="(day, index) in daysOfWeekArr.length" 
      :key="index" @click="handleDaySelect(index)">{{ daysOfWeekArr[index] }}</button>
    </div>
    <BusinessLunchSection v-for="(subGroup) of businessStore.businessProducts.subGroups"
    :key="subGroup.id" 
    :subGroup="subGroup">
      <BusinessLunchCard v-for="(product) of subGroup.daysOfWeek[selectedDay]"
        :key="product.id"
        :product="product"
        :description="product.description"
        :day="currentDay"
        :imgSrc="product.imageLinks[0]"
        :isCardEmpty=false
        @select="onChoose(product)"
      />
      <!-- <BusinessLunchCard
        :name="'Не выбирать'"
        :subGroupIndex="subGroupIndex"
        :imgSrc="'/icons/IconCancel.svg'"
        :isCardEmpty=true
      /> -->
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
  </div>
</template>

<script setup>
import { BusinessLunchCard, BusinessLunchSection } from '@/components'
import { ref } from 'vue';
import { useBusinessStore } from '@/stores/business.store';
// import { useOrderStore } from '@/stores/order.store';

const emit = defineEmits(['choose'])

// const orderStore = useOrderStore()
const selectedDay = ref((new Date().getDay())-1)
const currentDay = (new Date().getDay())-1
const isCurrentDaySelected = ref(true)

const businessStore = useBusinessStore()

businessStore.isCurrentDaySelected=true

const orderCost = ref(0)

const onChoose = (product) => emit('choose', product)

const handleDaySelect = (dayIndex) => {
  selectedDay.value = dayIndex
  if (selectedDay.value == currentDay) {
    isCurrentDaySelected.value=true
    businessStore.isCurrentDaySelected = true
  } else {
    isCurrentDaySelected.value=false 
    businessStore.isCurrentDaySelected = false
  }
}

const daysOfWeekArr = ref(['ПОНЕДЕЛЬНИК', 'ВТОРНИК', 'СРЕДА', 'ЧЕТВЕРГ', 'ПЯТНИЦА'])
daysOfWeekArr.value[currentDay]="СЕГОДНЯ ◆"

// for (const subGroup of businessStore.businessProducts.subGroups) {
//   for (const product of subGroup.daysOfWeek[selectedDay.value]) {
    
//   }
// }

businessStore.$subscribe(() => {
  orderCost.value = businessStore.finalCost
})

// const onMakeOrder = () => {
//   for (const orderItem of businessStore.businessOrder) {
//     // if (orderItem.product!=null && orderStore.order.filter((product) => product.id==orderItem.product.id).length==0 && orderStore.order.filter((product) => product.parentGroup==orderItem.product.parentGroup).length==0) {
//     //   orderItem.product.amount=1
//     //   orderStore.orderInfo.orderAmount+=1
//     //   orderStore.order.push(orderItem.product)
//     //   orderItem.product=null
//     // } else {
//     //   orderItem.product=null
//     // }
//     if (orderItem.product!=null) {
//       orderItem.product.amount+=1
//       orderStore.orderInfo.orderAmount+=1
//       orderStore.order.push(orderItem.product)
//       orderItem.product=null
//     }
//   }
// }

</script>
