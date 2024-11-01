import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', {
  state: () => ({
    productsList: [],
    drinksSubGroupsId: [],
    orderFunc: false,
    isStopListIsParsing: false,
  }),
  actions: {
    setProductsList(products) {
      this.productsList = products
    }
  },
  persist: true
})
