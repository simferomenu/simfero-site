import axios from 'axios'
import { stopListWorkaround } from '@/composables/stopListWorkaround.js'

export function menuInit(){
  const table = window.localStorage.getItem('selectedTables')[0]
  axios.get(`/info/:${table}`).then((infoResponse) => {
    const currentMenuVersion = window.localStorage.getItem('menuVersion')
    if (currentMenuVersion==null) {
      axios.get('/menu').then((menuResponse) => {
        stopListWorkaround(menuResponse.data)
        window.localStorage.setItem('menu', menuResponse.data)
      })
      window.localStorage.setItem('menuVersion', infoResponse.data.menuVersion.value)
    } else if (currentMenuVersion != null && currentMenuVersion != infoResponse.data.menuVersion.value) {
      axios.get('/menu').then((menuResponse) => {
        stopListWorkaround(menuResponse.data)
      })
      window.localStorage.setItem('menuVersion', infoResponse.data.menuVersion.value)
    }
  })
}