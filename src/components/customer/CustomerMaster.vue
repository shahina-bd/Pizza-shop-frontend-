<template>
    <div class="pizza-page">
        <nav class="navbar navbar-expand-lg pizza-navbar">
            <div class="container">
                <router-link class="navbar-brand" to="/">
                    <i class="fas fa-pizza-slice pizza-logo-icon"></i>
                    <div class="pizza-logo-text">
                        <span class="brand-name">Pizza</span>
                        <span class="brand-tagline">Delicious</span>
                    </div>
                </router-link>

                <button
                    class="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#pizzaNavbar"
                    aria-controls="pizzaNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <i class="fas fa-bars text-white"></i>
                </button>

                <div class="collapse navbar-collapse" id="pizzaNavbar">
                    <ul class="pizza-nav-links mx-auto">
                        <li>
                            <router-link to="/" :class="{ active: isActive('/') }">Home</router-link>
                        </li>
                        <li>
                            <router-link to="/menu" :class="{ active: isActive('/menu') }">Menu</router-link>
                        </li>
                        <li>
                            <a href="#services" @click.prevent="scrollTo('services')">Services</a>
                        </li>
                        <li>
                            <router-link to="/blog" :class="{ active: isActive('/blog') }">Blog</router-link>
                        </li>
                        <li>
                            <router-link to="/about" :class="{ active: isActive('/about') }">About</router-link>
                        </li>
                        <li>
                            <router-link to="/contact" :class="{ active: isActive('/contact') }">Contact</router-link>
                        </li>
                    </ul>

                    <div class="pizza-nav-actions d-flex align-items-center gap-2 mt-3 mt-lg-0">
                        <router-link class="btn btn-pizza-cart" to="/cart">
                            <i class="fas fa-shopping-cart me-1"></i>
                            Cart
                            <span class="badge ms-1" style="background: var(--pizza-gold); color: #000;">
                                {{ cartStore.totalItems }}
                            </span>
                        </router-link>

                        <template v-if="customerAuthStore.isAuthenticated">
                            <router-link class="btn btn-pizza-cart" to="/customer/dashboard">
                                {{ customerAuthStore.user?.name }}
                            </router-link>
                            <button class="btn btn-pizza-gold" @click="logout">Logout</button>
                        </template>

                        <template v-else>
                            <router-link class="btn btn-pizza-gold" to="/customer/login">Login</router-link>
                        </template>
                    </div>
                </div>
            </div>
        </nav>

        <slot></slot>

        <!-- Floating Aside Cart Widget -->
        <router-link
            to="/cart"
            class="pizza-floating-cart"
            v-if="cartStore.totalItems > 0"
            :class="{ 'cart-badge-bounce-anim': isBouncing }"
            title="View Cart"
        >
            <i class="fas fa-shopping-basket"></i>
            <span class="pizza-floating-cart-badge">{{ cartStore.totalItems }}</span>
        </router-link>

        <PizzaFooter />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useCustomerAuthStore } from '@/stores/customerAuth'
import PizzaFooter from '@/components/customer/PizzaFooter.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const customerAuthStore = useCustomerAuthStore()

const isBouncing = ref(false)

const isActive = (path) => route.path === path

const scrollTo = (id) => {
    if (route.path !== '/') {
        router.push({ path: '/', hash: `#${id}` })
        return
    }

    const el = document.getElementById(id)
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
    }
}

const logout = async () => {
    await customerAuthStore.logout()
    router.push('/')
}

// Watch total items to trigger bounce animation on cart addition
watch(
    () => cartStore.totalItems,
    (newVal, oldVal) => {
        if (newVal > oldVal) {
            isBouncing.value = true
            setTimeout(() => {
                isBouncing.value = false
            }, 800)
        }
    }
)
</script>
