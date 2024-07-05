import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => {
        const selectedTables = window.localStorage.getItem('selectedTables')
        return selectedTables ? import('../views/HomeView.vue') : import('../views/WaiterView.vue')
      }
    },
    {
      path: '/waiter',
      name: 'waiter',
      component: () => import('../views/WaiterView.vue')
    },
    {
      path: '/tables',
      name: 'tables',
      component: () => import('../views/TablesView.vue')
    }
  ]
})

export default router
