import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

axios.defaults.baseURL = 'https://api.simfero.cirus-it.com';

import './assets/index.css'
import axios from 'axios';

const app = createApp(App)

app.use(router)

app.mount('#app')
