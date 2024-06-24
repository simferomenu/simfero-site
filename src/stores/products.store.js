import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', {
  state: () => ({
    productsList: [],
    productsListFull: []
  }),
  actions: {
    setProductsList(products) {
      this.productsList = products;
    }
  },
  persist: true
})
