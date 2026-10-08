import HomeView from '@/views/customer/HomeView.vue'
import BlogView from '@/views/customer/BlogView.vue'
import CartView from '@/views/customer/CartView.vue'
import AboutView from '@/views/customer/AboutView.vue'
import ContactView from '@/views/customer/ContactView.vue'
import MenuView from '@/views/customer/MenuView.vue'
import CustomerLoginView from '@/views/customer/CustomerLoginView.vue'
import CustomerRegisterView from '@/views/customer/CustomerRegisterView.vue'
import CustomerDashboardView from '@/views/customer/CustomerDashboardView.vue'
import CustomerOrderDetailsView from '@/views/customer/CustomerOrderDetailsView.vue'
import CustomerOrderListView from '@/views/customer/CustomerOrderListView.vue'
import OrderSuccessView from '@/views/customer/OrderSuccessView.vue'

const customerRoutes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartView,
  },
  {
    path: '/blog',
    name: 'blog',
    component: BlogView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactView,
  },
  {
    path: '/menu',
    name: 'menu',
    component: MenuView,
  },
  {
    path: '/customer/login',
    name: 'customer.login',
    component: CustomerLoginView,
  },
  {
    path: '/customer/register',
    name: 'customer.register',
    component: CustomerRegisterView,
  },
  {
    path: '/customer/dashboard',
    name: 'customer.dashboard',
    component: CustomerDashboardView,
  },
  {
    path: '/customer/orders',
    name: 'customer.orders',
    component: CustomerOrderListView,
  },
  {
    path: '/customer/orders/:id',
    name: 'customer.orders.show',
    component: CustomerOrderDetailsView,
  },
  {
    path: '/payment/success',
    name: 'payment.success',
    component: OrderSuccessView,
  },
  {
    path: '/order/success',
    name: 'order.success',
    component: OrderSuccessView,
  },
]

export default customerRoutes
