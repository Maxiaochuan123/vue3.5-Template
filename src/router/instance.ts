import routes from './index'
import { createRouter, createWebHistory } from 'vue-router'
import { setupRouterGuard } from './guard'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_PUBLIC_PATH),
  routes,
})

// 设置路由守卫
setupRouterGuard(router)

export default router 