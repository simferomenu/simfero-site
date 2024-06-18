import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => ({
    order: [],
    orderInfo: {orderAmount: 0}
  }),
  getters: {},
  actions: {},
  persist: true
})
