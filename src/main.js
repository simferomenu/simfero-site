import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

axios.defaults.baseURL = 'https://api.simfero.cirus-it.com'

import './assets/index.css'
import axios from 'axios'

const app = createApp(App)

app.use(router)

app.mount('#app')

// const animatedElements = document.getElementsByClassName('animated')

// for (let i = 0; i < animatedElements.length; i++) {
//   animatedElements[i].onload = () => {
//     animatedElements[i].animationPlayState = 'running'
//   }
// }
