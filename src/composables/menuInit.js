import axios from 'axios'
import { stopListWorkaround } from '@/composables/stopListWorkaround.js'
import {menu} from '@/assets/testingMenu.json'

export function menuInit(){
  const table = window.localStorage.getItem('selectedTables')[0]
  axios.get(`/info/:${table}`).then((infoResponse) => {
    const currentMenuVersion = window.localStorage.getItem('menuVersion')
    if (currentMenuVersion==null || currentMenuVersion !== infoResponse.data.menuVersion.value) {
      axios.get('/menu').then((menuResponse) => {
        stopListWorkaround(menu)
        window.localStorage.setItem('menu', JSON.stringify(menuResponse.data.products))
        window.localStorage.setItem('menuVersion', infoResponse.data.menuVersion.value)
      })
    }
  })
}