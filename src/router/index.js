import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      // path: '/dish/:dishNickname',
      path: '/dish/tuna',
      name: 'dish',
      component: () => import('../views/DishView.vue')
    },
    {
      // path: '/dish/:dishNickname',
      path: '/order',
      name: 'order',
      component: () => import('../views/OrderView.vue')
    }
  ]
})

export default router
