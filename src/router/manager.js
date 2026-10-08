import LoginView from '@/views/manager/LoginView.vue'
import DashboardView from '@/views/manager/DashboardView.vue'
import ProductsView from '@/views/manager/ProductsView.vue'
import OrdersView from '@/views/manager/OrdersView.vue'

const managerRoutes = [
  {
    path: '/manager/login',
    name: 'manager.login',
    component: LoginView,
    meta: { requireGuest: true },
  },
  {
    path: '/manager/dashboard',
    name: 'manager.dashboard',
    component: DashboardView,
    meta: { requireAuth: true, roles: ['manager', 'admin'] },
  },
  {
    path: '/manager/products',
    name: 'manager.products',
    component: ProductsView,
    meta: { requireAuth: true, roles: ['manager', 'admin'] },
  },
  {
    path: '/manager/orders',
    name: 'manager.orders',
    component: OrdersView,
    meta: { requireAuth: true, roles: ['manager', 'admin'] },
  },
  {
    path: '/manager',
    redirect: '/manager/dashboard',
  },
]

export default managerRoutes
