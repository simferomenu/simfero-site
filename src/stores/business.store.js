import { defineStore } from 'pinia'

export const useBusinessStore = defineStore('business',{
  state: () => ({
    isBusinessVisible: false,
    businessProducts: [],
    businessOrder: [],
    finalCost: 0
  }),
  getters: {},
  actions: {},
  persist: true
})
