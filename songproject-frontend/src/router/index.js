import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import LogoutView from '@/views/LogoutView.vue'
import PlayView from '@/views/PlayView.vue'
import FaqView from '@/views/FaqView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/log-in',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/log-out',
    name: 'logout',
    component: LogoutView,
    component: FaqView,
  },

  {
    path: '/songs/:id',
    name: 'play',
    component: PlayView,
    props: true
  },
  {
    path: '/faq',
    name: 'faq',
    component: FaqView,
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router