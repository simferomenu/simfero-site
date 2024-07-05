import { defineStore } from 'pinia'

export const useBusinessStore = defineStore('business', {
  state: () => ({
    isBusinessVisible: false,
    isBusinessAvailable: true,
    businessProducts: [],
    isCurrentDaySelected: null
  }),
  getters: {},
  actions: {},
  persist: true
})
