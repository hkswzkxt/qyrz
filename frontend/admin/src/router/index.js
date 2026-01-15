import { createRouter, createWebHistory } from 'vue-router'
import FormList from '../components/FormList.vue'
import Config from '../components/Config.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'formList',
      component: FormList
    },
    {
      path: '/config',
      name: 'config',
      component: Config
    }
  ]
})

export default router
