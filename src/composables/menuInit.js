import axios from 'axios'
import { stopListWorkaround } from '@/composables/stopListWorkaround.js'

import { useProductsStore } from '@/stores/products.store.js'


export function menuInit(){
  const productStore = useProductsStore()
  const table = JSON.parse(window.localStorage.getItem('selectedTables'))[0]
  axios.get(`/info/:${table}`).then((infoResponse) => {
    const currentMenuVersion = window.localStorage.getItem('menuVersion') || ''
    console.log(`currentMenuVersion - ${currentMenuVersion}`)
    if (currentMenuVersion !== infoResponse.data.menuVersion.value) {
      productStore.isStopListIsParsing = true
      axios.get('/menu').then((menuResponse) => {
        stopListWorkaround(menuResponse.data)
        window.localStorage.setItem('menu', JSON.stringify(menuResponse.data.products))
        window.localStorage.setItem('menuVersion', infoResponse.data.menuVersion.value)
      })
    }
  })
}