import { defineStore } from 'pinia'

export const useBusinessStore = defineStore('business',{
  state: () => ({
    isBusinessVisible: false,
    businessProducts: [],
    businessOrder: []
  }),
  getters: {},
  actions: {},
  persist: true
})
