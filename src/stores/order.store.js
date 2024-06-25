import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => ({
    order: [],
    orderInfo: {
      orderId: null,
      orderAmount: 0
    }
  }),
  getters: {},
  actions: {},
  persist: true
})
