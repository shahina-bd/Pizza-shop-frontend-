import { defineStore } from 'pinia'
import api from '@/utils/axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('admin_token') || null,
        isAuthenticated: !!localStorage.getItem('admin_token')
    }),
    
    actions: {
        async login(credentials) {
            try {
                const response = await api.post('v1/verify-otp', credentials)

                if (response.data.token) {
                    this.token = response.data.token
                    this.user = response.data.user
                    this.isAuthenticated = true

                    localStorage.setItem('admin_token', response.data.token)
                    localStorage.setItem('admin_user', JSON.stringify(response.data.user))

                    return true
                }

                return false
            } catch (error) {
                console.error('Login error:', error)
                return false
            }
        },

        async logout() {
            try {
                await api.post('v1/customer/logout')
            } catch (error) {
                console.error('Logout error:', error)
            } finally {
                this.token = null
                this.user = null
                this.isAuthenticated = false
                localStorage.removeItem('admin_token')
                localStorage.removeItem('admin_user')
            }
        },

        loadUser() {
            const userData = localStorage.getItem('admin_user')
            if (userData) {
                this.user = JSON.parse(userData)
            }
        }
    },

    getters: {
        getUser: (state) => state.user,
        isLoggedIn: (state) => state.isAuthenticated,
        userRoles: (state) => {
            if (!state.user) return []

            if (Array.isArray(state.user.roles) && state.user.roles.length) {
                return state.user.roles.map((role) => role.name?.toLowerCase()).filter(Boolean)
            }

            if (state.user.role_name) {
                return [state.user.role_name.toLowerCase()]
            }

            if (state.user.role) {
                return [state.user.role.toLowerCase()]
            }

            return []
        },
        isAdmin: (state) => {
            const roles = Array.isArray(state.user?.roles)
                ? state.user.roles.map((role) => role.name?.toLowerCase())
                : state.user?.role_name
                    ? [state.user.role_name.toLowerCase()]
                    : state.user?.role
                        ? [state.user.role.toLowerCase()]
                        : []

            return roles.includes('admin')
        },
        isManager: (state) => {
            const roles = Array.isArray(state.user?.roles)
                ? state.user.roles.map((role) => role.name?.toLowerCase())
                : state.user?.role_name
                    ? [state.user.role_name.toLowerCase()]
                    : state.user?.role
                        ? [state.user.role.toLowerCase()]
                        : []

            return roles.includes('manager')
        },
        canManageProductsOrders: (state) => {
            const roles = Array.isArray(state.user?.roles)
                ? state.user.roles.map((role) => role.name?.toLowerCase())
                : state.user?.role_name
                    ? [state.user.role_name.toLowerCase()]
                    : state.user?.role
                        ? [state.user.role.toLowerCase()]
                        : []

            return roles.includes('admin') || roles.includes('manager')
        }
    }
})
