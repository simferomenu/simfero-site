import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', {
  state: () => ({
    productsList: [],
    drinksSubGroupsId: []
  }),
  actions: {
    setProductsList(products) {
      this.productsList = products
    }
  },
  persist: true
})
