import { defineStore } from 'pinia'

export const useOrderStore = defineStore({
  id: 'order',
  state: () => ({
    order: [],
    orderInfo: {orderAmount: 0}
  }),
  getters: {},
  actions: {}
})
