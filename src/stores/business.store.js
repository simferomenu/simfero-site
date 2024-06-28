import { defineStore } from 'pinia'

export const useBusinessStore = defineStore('business',{
  state: () => ({
    isBusinessVisible: false,
    businessProducts: [],
  }),
  getters: {},
  actions: {},
  persist: true
})
