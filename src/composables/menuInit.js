// import useProductStore from '@/stores/products.store.js'
import axios from 'axios'
import { fillMenuProducts } from '@/composables/fillMenuProducts.js'

// const productStore = useProductStore()
export function menuInit(){
  const table = window.localStorage.getItem('selectedTables')[0]
  axios.get(`/info/:${table}`).then((infoResponse) => {
    const currentMenuVersion = window.localStorage.getItem('menuVersion')
    if (currentMenuVersion==null) {
      axios.get('/menu').then((menuResponse) => {
        let menuProducts = menuResponse.data
        fillMenuProducts(false, menuProducts)
      })
    } else if (currentMenuVersion != null && currentMenuVersion != infoResponse.data.menuVersion.value) {
      axios.get('/menu').then((menuResponse) => {
        let menuProducts = menuResponse.data
        fillMenuProducts(true, menuProducts)
      })
    }
  })
}