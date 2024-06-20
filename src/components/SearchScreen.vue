<template>
  <div
    class="fixed top-0 left-0 flex justify-center items-center w-screen h-screen search-bg box-border overflow-hidden z-[5] !pointer-events-auto"
  >
    <IconCross @click="$emit('closeSearch')" />
    <div class="relative w-[455px] h-[505px] flex flex-col box-border">
      <div class="relative w-full h-fit mb-[30px] shrink-0 box-border pr-[12px]">
        <input type="text" class="input-field" />
        <img
          class="absolute left-[11px] top-[12px] w-[41px] h-[41px] pointer-events-none user-select-none"
          src="/icons/IconInputLogo.svg"
          alt=""
        />
      </div>
      <div
        class="w-full h-full !overflow-auto [&>*:not(:last-child)]:mb-[20px] box-border pr-[12px]"
      >
        <div
          class="relative w-full flex justify-between box-border pb-[20px] border-solid border-b-[#fff] border-b-[1px]"
        >
          <div class="relative flex flex-col justify-between">
            <span
              class="font-Segoe font-semibold text-[16px] tracking-[0.06em] uppercase text-[#fff]"
              >Тунец мацухиса</span
            >
            <span class="font-Segoe font-[350] text-[14px] tracking-[0.05em] text-[#fff]"
              >Японская кухня, 200 г.</span
            >
          </div>
          <span class="font-Segoe font-semibold text-[16px] tracking-[0.06em] uppercase text-gold"
            >1 200 РУБ.</span
          >
        </div>
        <div
          class="relative w-full flex justify-between box-border pb-[20px] border-solid border-b-[#fff] border-b-[1px]"
        >
          <div class="relative flex flex-col justify-between">
            <span
              class="font-Segoe font-semibold text-[16px] tracking-[0.06em] uppercase text-[#fff]"
              >Тунец мацухиса</span
            >
            <span class="font-Segoe font-[350] text-[14px] tracking-[0.05em] text-[#fff]"
              >Японская кухня, 200 г.</span
            >
          </div>
          <span class="font-Segoe font-semibold text-[16px] tracking-[0.06em] uppercase text-gold"
            >1 200 РУБ.</span
          >
        </div>
        <div
          class="relative w-full flex justify-between box-border pb-[20px] border-solid border-b-[#fff] border-b-[1px]"
        >
          <div class="relative flex flex-col justify-between">
            <span
              class="font-Segoe font-semibold text-[16px] tracking-[0.06em] uppercase text-[#fff]"
              >Тунец мацухиса</span
            >
            <span class="font-Segoe font-[350] text-[14px] tracking-[0.05em] text-[#fff]"
              >Японская кухня, 200 г.</span
            >
          </div>
          <span class="font-Segoe font-semibold text-[16px] tracking-[0.06em] uppercase text-gold"
            >1 200 РУБ.</span
          >
        </div>
        <div
          class="relative w-full flex justify-between box-border pb-[20px] border-solid border-b-[#fff] border-b-[1px]"
        >
          <div class="relative flex flex-col justify-between">
            <span
              class="font-Segoe font-semibold text-[16px] tracking-[0.06em] uppercase text-[#fff]"
              >Тунец мацухиса</span
            >
            <span class="font-Segoe font-[350] text-[14px] tracking-[0.05em] text-[#fff]"
              >Японская кухня, 200 г.</span
            >
          </div>
          <span class="font-Segoe font-semibold text-[16px] tracking-[0.06em] uppercase text-gold"
            >1 200 РУБ.</span
          >
        </div>
        <div
          class="relative w-full flex justify-between box-border pb-[20px] border-solid border-b-[#fff] border-b-[1px]"
        >
          <div class="relative flex flex-col justify-between">
            <span
              class="font-Segoe font-semibold text-[16px] tracking-[0.06em] uppercase text-[#fff]"
              >Тунец мацухиса</span
            >
            <span class="font-Segoe font-[350] text-[14px] tracking-[0.05em] text-[#fff]"
              >Японская кухня, 200 г.</span
            >
          </div>
          <span class="font-Segoe font-semibold text-[16px] tracking-[0.06em] uppercase text-gold"
            >1 200 РУБ.</span
          >
        </div>
        <div
          class="relative w-full flex justify-between box-border pb-[20px] border-solid border-b-[#fff] border-b-[1px]"
        >
          <div class="relative flex flex-col justify-between">
            <span
              class="font-Segoe font-semibold text-[16px] tracking-[0.06em] uppercase text-[#fff]"
              >Тунец мацухиса</span
            >
            <span class="font-Segoe font-[350] text-[14px] tracking-[0.05em] text-[#fff]"
              >Японская кухня, 200 г.</span
            >
          </div>
          <span class="font-Segoe font-semibold text-[16px] tracking-[0.06em] uppercase text-gold"
            >1 200 РУБ.</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IconCross } from '@/components'
</script>
