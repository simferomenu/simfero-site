<template>
  <div
    class="relative flex flex-col shrink-1 w-full h-screen overflow-x-hidden box-border main-bg py-[40px] pl-[37px] pointer-events-auto"
  >
    <span
      class="font-normal text-[#000] uppercase text-[36px] leading-[117%] tracking-[0.11em] font-Sitka mr-[14px] block shrink-0 w-fit pb-[40px] pt-[20px]"
    >
      ДЕЛОВЫЕ ОБЕДЫ
    </span>
    <div class="flex flex-row gap-[10px] pb-[40px]">
      <button
        class="rounded-[21px] px-[20px] pt-[10px] pb-[10px] text-[14px] font-[350] menu-card-bg"
        :class="{
          'bg-black text-white font-semilight': index === selectedDay,
          'font-semibold ': index === currentDay
        }"
        v-for="(day, index) in daysOfWeekArr.length"
        :key="index"
        @click="handleDaySelect(index)"
      >
        {{ daysOfWeekArr[index] }}
      </button>
    </div>
    <BusinessLunchSection
      v-for="subGroup of businessStore.businessProducts.subGroups"
      :key="subGroup.id"
      :subGroup="subGroup"
    >
      <BusinessLunchCard
        v-for="product of subGroup.daysOfWeek[selectedDay]"
        :key="product.id"
        :product="product"
        :description="product.description"
        :day="currentDay"
        :imgSrc="product.imageLinks[0]"
        :isCardEmpty="false"
        @select="onChoose(product)"
      />
    </BusinessLunchSection>
  </div>
</template>

<script setup>
import { BusinessLunchCard, BusinessLunchSection } from '@/components'
import { ref } from 'vue'
import { useBusinessStore } from '@/stores/business.store'

const emit = defineEmits(['choose'])
const businessStore = useBusinessStore()

const selectedDay = ref(null)
const currentDay = new Date().getDay() - 1
const currentTime = new Date().getHours()
if (currentDay > 4) {
  selectedDay.value = 0
} else {
  selectedDay.value = new Date().getDay() - 1
}

if (currentTime >= 11 && currentTime < 16 && currentDay <= 4) {
  businessStore.isBusinessAvailable = true
} else {
  businessStore.isBusinessAvailable = false
}

const isCurrentDaySelected = ref(true)

businessStore.isCurrentDaySelected = true

const onChoose = (product) => emit('choose', product)

const handleDaySelect = (dayIndex) => {
  selectedDay.value = dayIndex
  if (selectedDay.value == currentDay) {
    isCurrentDaySelected.value = true
    businessStore.isCurrentDaySelected = true
  } else {
    isCurrentDaySelected.value = false
    businessStore.isCurrentDaySelected = false
  }
}

const daysOfWeekArr = ref(['ПОНЕДЕЛЬНИК', 'ВТОРНИК', 'СРЕДА', 'ЧЕТВЕРГ', 'ПЯТНИЦА'])
if (currentDay <= 4) {
  daysOfWeekArr.value[currentDay] = 'СЕГОДНЯ ◆'
}
</script>
