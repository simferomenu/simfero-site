import { defineStore } from 'pinia'

export const useOrderStore = defineStore('order', {
  state: () => ({
    order: [],
    preOrder: [],
    orderInfo: {
      orderId: null,
      orderAmount: 0
    }
  }),
  getters: {},
  actions: {},
  persist: true
})
