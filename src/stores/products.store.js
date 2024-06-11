import { defineStore } from 'pinia'

export const useProductsStore = defineStore({
  id: 'products',
  state: () => ({
    productsList: []
  }),
  actions: {
    setProductsList(products) {
      this.productsList = products
    }
  }
})
