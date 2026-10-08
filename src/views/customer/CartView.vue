<template>
    <CustomerMaster>
        <section class="pizza-section">
            <div class="container">
                <div class="pizza-section-title text-start mb-4">
                    <span class="accent">Your Order</span>
                    <h2>Cart Details</h2>
                </div>

                <div class="alert alert-info" v-if="cartStore.items.length === 0">
                    Your cart is empty.
                    <router-link to="/" class="alert-link">Continue Shopping</router-link>
                </div>

                <div class="row" v-else>
                    <div class="col-lg-8">
                        <div class="card mb-3" v-for="item in cartStore.items" :key="item.id">
                            <div class="card-body">
                                <div class="row align-items-center">
                                    <div class="col-md-2">
                                        <img :src="item.image" :alt="item.name" class="img-fluid rounded border"
                                            style="height: 80px; object-fit: cover;">
                                    </div>

                                    <div class="col-md-4">
                                        <h6 class="mb-1">{{ item.name }}</h6>
                                        <p class="text-muted mb-0">৳ {{ item.price }}</p>
                                    </div>

                                    <div class="col-md-3">
                                        <div class="btn-group">
                                            <button class="btn btn-outline-secondary btn-sm"
                                                @click="cartStore.decreaseQuantity(item.id)">
                                                -
                                            </button>

                                            <button class="btn btn-outline-secondary btn-sm" disabled>
                                                {{ item.quantity }}
                                            </button>

                                            <button class="btn btn-outline-secondary btn-sm"
                                                @click="cartStore.increaseQuantity(item.id)">
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div class="col-md-2">
                                        <strong>৳ {{ item.price * item.quantity }}</strong>
                                    </div>

                                    <div class="col-md-1 text-end">
                                        <button class="btn btn-sm btn-danger" @click="cartStore.removeItem(item.id)">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card mt-4">
                            <div class="card-header">
                                <h5 class="mb-0">Shipping Information</h5>
                            </div>

                            <div class="card-body">
                                <div v-if="errorMessage" class="alert alert-danger">
                                    {{ errorMessage }}
                                </div>

                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Customer Name</label>
                                        <input type="text" class="form-control" v-model="checkoutForm.customer_name">
                                    </div>

                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Customer Phone</label>
                                        <input type="text" class="form-control" v-model="checkoutForm.customer_phone">
                                    </div>

                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Customer Email</label>
                                        <input type="email" class="form-control" v-model="checkoutForm.customer_email">
                                    </div>

                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Payment Method</label>
                                        <select class="form-select" v-model="checkoutForm.payment_method">
                                            <option value="cod">Cash On Delivery</option>
                                            <option value="sslcommerz">SSLCommerz</option>
                                        </select>
                                    </div>

                                    <div class="col-12 mb-3">
                                        <label class="form-label">Shipping Address</label>
                                        <textarea class="form-control" rows="3"
                                            v-model="checkoutForm.shipping_address"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="card shadow-sm">
                            <div class="card-header">
                                <h5 class="mb-0">Order Summary</h5>
                            </div>

                            <div class="card-body">
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Total Items</span>
                                    <strong>{{ cartStore.totalItems }}</strong>
                                </div>

                                <div class="d-flex justify-content-between mb-3">
                                    <span>Total Amount</span>
                                    <strong>৳ {{ cartStore.totalAmount }}</strong>
                                </div>

                                <button class="btn btn-pizza-primary w-100" @click="confirmOrder" :disabled="isCheckingOut">
                                    {{ isCheckingOut ? 'Processing...' : 'Checkout' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </CustomerMaster>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/utils/axios'
import { useCartStore } from '@/stores/cart'
import { useCustomerAuthStore } from '@/stores/customerAuth'
import CustomerMaster from '@/components/customer/CustomerMaster.vue'

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const customerAuthStore = useCustomerAuthStore()

const isCheckingOut = ref(false)
const errorMessage = ref('')

const checkoutForm = ref({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    payment_method: 'sslcommerz',
})

onMounted(() => {
    if (customerAuthStore.user) {
        checkoutForm.value.customer_name = customerAuthStore.user.name ?? ''
        checkoutForm.value.customer_email = customerAuthStore.user.email ?? ''
        checkoutForm.value.customer_phone = customerAuthStore.user.mobile ?? ''
        checkoutForm.value.shipping_address = customerAuthStore.user.address ?? ''
    }
})

const confirmOrder = async () => {
    errorMessage.value = ''

    if (!customerAuthStore.isAuthenticated) {
        router.push({
            name: 'customer.login',
            query: {
                redirect: route.fullPath,
            },
        })

        return
    }

    if (!checkoutForm.value.customer_name) {
        errorMessage.value = 'Customer name is required.'
        return
    }

    if (!checkoutForm.value.customer_phone) {
        errorMessage.value = 'Customer phone is required.'
        return
    }

    if (!checkoutForm.value.customer_email) {
        errorMessage.value = 'Customer email is required.'
        return
    }

    if (!checkoutForm.value.shipping_address) {
        errorMessage.value = 'Shipping address is required.'
        return
    }

    isCheckingOut.value = true

    try {
        const payload = {
            user_id: customerAuthStore.user.id ?? '',
            customer_name: checkoutForm.value.customer_name,
            customer_email: checkoutForm.value.customer_email,
            customer_phone: checkoutForm.value.customer_phone,
            address: checkoutForm.value.shipping_address,
            payment_method: checkoutForm.value.payment_method,

            items: cartStore.items.map(item => ({
                pizza_id: item.id,
                quantity: item.quantity,
            })),
        }

        const response = await api.post('v1/customer/checkout', payload)

        if (response.data.payment_url) {
            window.location.href = response.data.payment_url
            return
        }

        cartStore.clearCart()
        router.push({ 
            name: 'order.success',
            query: { order: response.data.order_id }
        })
    } catch (error) {
        if (error.response?.data?.errors) {
            const firstError = Object.values(error.response.data.errors)[0]
            errorMessage.value = Array.isArray(firstError) ? firstError[0] : firstError
        } else {
            errorMessage.value = error.response?.data?.message || 'Checkout failed.'
        }
    } finally {
        isCheckingOut.value = false
    }
}
</script>