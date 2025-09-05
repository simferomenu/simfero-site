import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'

// axios.defaults.baseURL = 'http://localhost:3000'
axios.maxContentLength = 3000
axios.defaults.baseURL = 'http://178.34.180.164:3000'
axios.defaults.headers.publicKey = 'eYd75HxAXtTbj6q4aZRPnrKgLvyGWMc9FfU8kNmE'

import './assets/index.css'
import axios from 'axios'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

app.use(router)
app.use(pinia)
app.mount('#app')

import { registerSW } from 'virtual:pwa-register'

const intervalMS = 30 * 60 * 1000 // Check for updates every 30 minutes

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Доступно обновление. Перезагрузить?')) {
      updateSW(true)
    }
  },
  onRegisteredSW(swUrl, r) {
    r && setInterval(async () => {
      if (!(!r.installing && navigator))
        return
      
      if (('connection' in navigator) && !navigator.onLine)
        return
      
      const resp = await fetch(swUrl, {
        cache: 'no-store',
        headers: {
          'cache': 'no-store',
          'cache-control': 'no-cache',
        },
      })
      
      if (resp?.status === 200)
        await r.update()
    }, intervalMS)
  }
})

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
