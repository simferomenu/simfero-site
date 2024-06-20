import { defineStore } from 'pinia'

export const useBusinessStore = defineStore({
  id: 'business',
  state: () => ({
    isBusinessVisible: false,
    businessProducts: []
  }),
  getters: {},
  actions: {}
})
