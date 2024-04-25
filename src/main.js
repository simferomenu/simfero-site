import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

axios.defaults.baseURL = 'https://api.simfero.cirus-it.com'

import './assets/index.css'
import axios from 'axios'

const app = createApp(App)

app.use(router)

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
