import { defineStore } from 'pinia'

export const useOrderStore = defineStore({
  id: 'order',
  state: () => ({
    order: []
  }),
  getters: {},
  actions: {}
})
