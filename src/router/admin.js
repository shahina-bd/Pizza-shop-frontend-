import LoginView from '@/views/admin/LoginView.vue'
import DashboardView from '@/views/admin/DashboardView.vue'
import ProductIndex from '@/components/admin/ProductIndex.vue'
import PermissionIndex from '@/views/admin/permission/PermissionIndex.vue'
import Createpermission from '@/views/admin/permission/Createpermission.vue'
import CreateRole from '@/views/admin/role/CreateRole.vue'
import RoleIndex from '@/views/admin/role/RoleIndex.vue'
import UserIndex from '@/views/admin/user/UserIndex.vue'
import OrderIndex from '@/views/admin/OrderIndex.vue'
import SalesReportView from '@/views/admin/SalesReportView.vue'
import ProductReportView from '@/views/admin/ProductReportView.vue'
import CustomerReportView from '@/views/admin/CustomerReportView.vue'
import OrderReportView from '@/views/admin/OrderReportView.vue'

const adminRoutes = [
  {
    path: '/admin/login',
    name: 'admin.login',
    component: LoginView,
    meta: { requireGuest: true },
  },
  {
    path: '/admin/dashboard',
    name: 'admin.dashboard',
    component: DashboardView,
    meta: { requireAuth: true, roles: ['admin', 'manager'] },
  },
  {
    path: '/admin/product-manage',
    name: 'admin.product-manage',
    component: ProductIndex,
    meta: { requireAuth: true, roles: ['admin', 'manager'] },
  },
  {
    path: '/admin/orders',
    name: 'admin.orders.index',
    component: OrderIndex,
    meta: { requireAuth: true, roles: ['admin', 'manager'] },
  },
  {
    path: '/admin/permissions',
    name: 'admin.permissions.index',
    component: PermissionIndex,
    meta: { requireAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/roles',
    name: 'admin.roles.index',
    component: RoleIndex,
    meta: { requireAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/roles/create',
    name: 'admin.roles.create',
    component: CreateRole,
    meta: { requireAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/users',
    name: 'admin.users.index',
    component: UserIndex,
    meta: { requireAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/permissions/create',
    name: 'admin.permissions.create',
    component: Createpermission,
    meta: { requireAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/reports/sales',
    name: 'admin.reports.sales',
    component: SalesReportView,
    meta: { requireAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/reports/products',
    name: 'admin.reports.products',
    component: ProductReportView,
    meta: { requireAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/reports/customers',
    name: 'admin.reports.customers',
    component: CustomerReportView,
    meta: { requireAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin/reports/orders',
    name: 'admin.reports.orders',
    component: OrderReportView,
    meta: { requireAuth: true, roles: ['admin'] },
  },
  {
    path: '/admin',
    redirect: '/admin/dashboard',
  },
]

export default adminRoutes
