<template>
    <CustomerMaster>
        <section class="pizza-hero">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6 pizza-hero-content">
                        <p class="pizza-hero-accent">Delicious</p>
                        <h1 class="pizza-hero-title">Italian Cuisine</h1>
                        <p class="pizza-hero-desc">
                            A small river named Duden flows by their place and supplies it with
                            the necessary regelialia. It is a paradise.
                        </p>
                        <div class="pizza-hero-buttons">
                            <router-link to="/cart" class="btn btn-pizza-primary">
                                Order Now
                            </router-link>
                            <router-link to="/menu" class="btn btn-pizza-outline">
                                View Menu
                            </router-link>
                        </div>
                    </div>

                    <div class="col-lg-6 pizza-hero-image">
                        <img
                            src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop"
                            alt="Fresh Margherita Pizza"
                        />
                    </div>
                </div>
            </div>
        </section>

        <section id="services" class="pizza-section">
            <div class="container">
                <div class="pizza-section-title">
                    <span class="accent">Services</span>
                    <h2>What We Offer</h2>
                    <p>Fresh ingredients, fast delivery, and authentic Italian taste.</p>
                </div>

                <div class="row g-4">
                    <div class="col-md-4" v-for="service in services" :key="service.title">
                        <div class="pizza-card text-center p-4">
                            <i :class="service.icon" class="mb-3" style="font-size: 2.5rem; color: var(--pizza-gold);"></i>
                            <h5 class="text-white mb-2">{{ service.title }}</h5>
                            <p class="pizza-about-text mb-0">{{ service.desc }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="menu" class="pizza-section" style="background: #111;">
            <div class="container">
                <div class="pizza-section-title">
                    <span class="accent">Menu</span>
                    <h2>Our Pizzas</h2>
                    <p>Order your favorite pizza from our fresh selection.</p>
                </div>

                <div class="text-center py-5" v-if="isLoading">
                    <div class="spinner-border pizza-loading"></div>
                    <p class="mt-2 pizza-about-text">Loading pizzas...</p>
                </div>

                <div class="row g-4" v-else>
                    <div
                        class="col-md-6 col-lg-4"
                        v-for="(product, index) in products"
                        :key="product.id"
                    >
                        <ProductCard :product="product" :is-reversed="Math.floor(index / 3) % 2 === 1" />
                    </div>

                    <!-- Pagination Control -->
                    <div class="col-12 mt-5 d-flex justify-content-center animate-fade-in" v-if="lastPage > 1">
                        <nav aria-label="Pizza Menu Pagination">
                            <ul class="pizza-pagination">
                                <li :class="{ disabled: currentPage === 1 }">
                                    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" aria-label="Previous Page">
                                        <i class="fas fa-chevron-left"></i>
                                    </button>
                                </li>
                                <li v-for="page in lastPage" :key="page" :class="{ active: page === currentPage }">
                                    <button @click="changePage(page)">
                                        {{ page }}
                                    </button>
                                </li>
                                <li :class="{ disabled: currentPage === lastPage }">
                                    <button @click="changePage(currentPage + 1)" :disabled="currentPage === lastPage" aria-label="Next Page">
                                        <i class="fas fa-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <div class="col-12" v-if="products.length === 0">
                        <div class="alert pizza-empty text-center">
                            No pizzas available right now. Please check back soon!
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="about" class="pizza-section pizza-about">
            <div class="container">
                <div class="row align-items-center g-5">
                    <div class="col-lg-6">
                        <div class="pizza-section-title text-start mb-4">
                            <span class="accent">About</span>
                            <h2>Welcome to Pizza Delicious</h2>
                        </div>
                        <p class="pizza-about-text">
                            At Pizza Delicious, we craft every pizza with passion using the finest
                            ingredients — hand-stretched dough, rich tomato sauce, premium mozzarella,
                            and fresh basil. Our wood-fired ovens bring out the authentic Italian
                            flavor you crave.
                        </p>
                        <p class="pizza-about-text">
                            Whether you dine in, take away, or order online, we deliver the same
                            quality and taste that has made us a local favorite.
                        </p>
                    </div>
                    <div class="col-lg-6">
                        <img
                            src="/images/slider1.jpg"
                            alt="Pizza restaurant"
                            class="img-fluid"
                            style="filter: drop-shadow(0 15px 30px rgba(0,0,0,0.5));"
                            @error="onAboutImageError"
                        />
                    </div>
                </div>
            </div>
        </section>

        <section id="contact" class="pizza-section pizza-contact">
            <div class="container">
                <div class="row g-0 align-items-stretch pizza-contact-split">
                    <div class="col-lg-6">
                        <div class="pizza-contact-map-wrap">
                            <iframe
                                class="pizza-contact-map"
                                title="Pizza Delicious Location"
                                loading="lazy"
                                referrerpolicy="no-referrer-when-downgrade"
                                src="https://www.google.com/maps?q=198+West+21th+Street,+New+York,+NY+10016&output=embed"
                            ></iframe>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        <div class="pizza-contact-form">
                            <h3 class="pizza-contact-form-title">Contact Us</h3>

                            <div v-if="contactSuccess" class="alert pizza-contact-alert-success">
                                <i class="fas fa-check-circle me-2"></i>
                                Thank you! Your message has been sent successfully.
                            </div>

                            <div v-if="contactError" class="alert pizza-contact-alert-error">
                                {{ contactError }}
                            </div>

                            <form @submit.prevent="handleContactSubmit">
                                <div class="row g-3">
                                    <div class="col-12">
                                        <label class="pizza-form-label">First Name</label>
                                        <input
                                            type="text"
                                            class="pizza-form-control"
                                            v-model="contactForm.first_name"
                                            required
                                        />
                                    </div>

                                    <div class="col-12">
                                        <label class="pizza-form-label">Last Name</label>
                                        <input
                                            type="text"
                                            class="pizza-form-control"
                                            v-model="contactForm.last_name"
                                            required
                                        />
                                    </div>

                                    <div class="col-12">
                                        <label class="pizza-form-label">Message</label>
                                        <textarea
                                            class="pizza-form-control"
                                            rows="3"
                                            v-model="contactForm.message"
                                            required
                                        ></textarea>
                                    </div>

                                    <div class="col-12">
                                        <button
                                            type="submit"
                                            class="btn pizza-contact-submit"
                                            :disabled="isContactSubmitting"
                                        >
                                            {{ isContactSubmitting ? 'Sending...' : 'Send' }}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </CustomerMaster>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/utils/axios'
import CustomerMaster from '@/components/customer/CustomerMaster.vue'
import ProductCard from '@/components/customer/ProductCard.vue'
import { useCustomerAuthStore } from '@/stores/customerAuth'

const route = useRoute()
const customerAuthStore = useCustomerAuthStore()
const products = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const lastPage = ref(1)
const isContactSubmitting = ref(false)
const contactSuccess = ref(false)
const contactError = ref('')

const contactForm = ref({
    first_name: '',
    last_name: '',
    message: '',
})

const services = [
    {
        icon: 'fas fa-pizza-slice',
        title: 'Fresh Pizzas',
        desc: 'Handcrafted pizzas baked fresh with premium ingredients every day.',
    },
    {
        icon: 'fas fa-motorcycle',
        title: 'Fast Delivery',
        desc: 'Hot pizza delivered to your doorstep in record time.',
    },
    {
        icon: 'fas fa-utensils',
        title: 'Dine In',
        desc: 'Enjoy a cozy atmosphere with authentic Italian dining experience.',
    },
]

const loadProducts = async (page = 1) => {
    isLoading.value = true

    try {
        const response = await api.get('pizzas', {
            params: { 
                page,
                per_page: 6
            }
        })
        products.value = response.data.data ?? []
        currentPage.value = response.data.meta?.current_page ?? 1
        lastPage.value = response.data.meta?.last_page ?? 1
    } catch (error) {
        console.error('Product loading error:', error)
        products.value = []
    } finally {
        isLoading.value = false
    }
}

const changePage = (page) => {
    if (page < 1 || page > lastPage.value) return
    loadProducts(page)
    const el = document.getElementById('menu')
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
    }
}

const scrollToMenu = () => {
    const el = document.getElementById('menu')
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
    }
}

const onAboutImageError = (event) => {
    event.target.src =
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop'
}

const prefillContactForm = () => {
    if (!customerAuthStore.isAuthenticated) {
        return
    }

    const fullName = (customerAuthStore.user?.name ?? '').trim()
    if (fullName) {
        const [firstName, ...rest] = fullName.split(' ')
        contactForm.value.first_name = firstName ?? ''
        contactForm.value.last_name = rest.join(' ')
    }
}

const handleContactSubmit = async () => {
    contactSuccess.value = false
    contactError.value = ''
    isContactSubmitting.value = true

    try {
        await api.post('v1/contact', contactForm.value)
        contactSuccess.value = true
        const previousFirstName = contactForm.value.first_name
        const previousLastName = contactForm.value.last_name
        contactForm.value = {
            first_name: previousFirstName,
            last_name: previousLastName,
            message: '',
        }
    } catch (error) {
        contactError.value =
            error.response?.data?.message || 'Failed to send message. Please try again later.'
    } finally {
        isContactSubmitting.value = false
    }
}

onMounted(() => {
    prefillContactForm()
    loadProducts()

    if (route.hash) {
        const id = route.hash.replace('#', '')
        setTimeout(() => {
            const el = document.getElementById(id)
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' })
            }
        }, 300)
    }
})
</script>

<style scoped>
.pizza-pagination {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 8px;
    align-items: center;
}

.pizza-pagination li button {
    background: transparent;
    border: 1px solid rgba(250, 197, 100, 0.3);
    color: var(--pizza-gold);
    width: 38px;
    height: 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.pizza-pagination li button:hover:not(:disabled) {
    background: rgba(250, 197, 100, 0.1);
    border-color: var(--pizza-gold);
    color: var(--pizza-gold);
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(250, 197, 100, 0.15);
}

.pizza-pagination li.active button {
    background: var(--pizza-gold);
    border-color: var(--pizza-gold);
    color: var(--pizza-black);
}

.pizza-pagination li.disabled button {
    opacity: 0.35;
    cursor: not-allowed;
    border-color: rgba(255, 255, 255, 0.1);
    color: var(--pizza-white);
}

.animate-fade-in {
    animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
