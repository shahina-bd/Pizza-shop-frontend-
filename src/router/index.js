import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import adminRoutes from './admin'
import managerRoutes from './manager'
import customerRoutes from './customer'

const routes = [...customerRoutes, ...adminRoutes, ...managerRoutes]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requireAuth && !isAuthenticated) {
    return '/admin/login'
  }

  if (to.meta.requireGuest && isAuthenticated) {
    return '/admin/dashboard'
  }

  const allowedRoles = to.meta.roles
  if (allowedRoles && allowedRoles.length > 0) {
    if (!authStore.isAuthenticated) {
      return '/admin/login'
    }

    const userRoles = authStore.userRoles || []
    const allowed = allowedRoles.some((role) => userRoles.includes(role.toLowerCase()))

    if (!allowed) {
      return '/admin/dashboard'
    }
  }

  return true
})

export default router
