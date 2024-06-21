import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

axios.defaults.baseURL = 'http://localhost:3000'
// axios.defaults.baseURL = 'https://api.simfero.cirus-it.com'

import './assets/index.css'
import axios from 'axios'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')

// const requestFullScreen = async () => {
//   let element = await document.documentElement
//   let requestMethod =
//     element.requestFullScreen ||
//     element.webkitRequestFullScreen ||
//     element.mozRequestFullScreen ||
//     element.msRequestFullScreen
//   if (requestMethod) {
//     requestMethod.call(element)
//     return true
//   } else if (typeof window.ActiveXObject !== 'undefined') {
//     let wscript = new ActiveXObject('WScript.Shell')
//     if (wscript !== null) {
//       wscript.SendKeys('{F11}')
//       return true
//     }
//   }
// }

// const lock = async () => {
//   var myScreenOrientation = window.screen.orientation
//   myScreenOrientation.lock(myScreenOrientation.type)
//   return true
// }

// requestFullScreen()
// lock()
