import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/utils/axios'
import { useCartStore } from './cart'

export const useCustomerAuthStore = defineStore('customerAuth', () => {
  const token = ref(localStorage.getItem('customer_token'))
  const user = ref(JSON.parse(localStorage.getItem('customer_user')) || null)

  const isAuthenticated = computed(() => {
    return !!token.value && token.value !== 'null' && token.value !== 'undefined' && token.value !== ''
  })

  const setAuth = (data) => {
    token.value = data.token
    user.value = data.user

    localStorage.setItem('customer_token', data.token)
    localStorage.setItem('customer_user', JSON.stringify(data.user))
  }

  const login = async (form) => {
    const response = await api.post('v1/customer/login', form)
    setAuth(response.data)
  }

  const register = async (form) => {
    const response = await api.post('v1/customer/register', form)
    setAuth(response.data)
  }

  const logout = async () => {
    try {
      await api.post('v1/customer/logout')
    } catch (error) {
      console.error(error)
    }

    token.value = null
    user.value = null
    localStorage.removeItem('customer_token')
    localStorage.removeItem('customer_user')

    const cartStore = useCartStore()
    cartStore.clearCart()
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout,
  }
})
