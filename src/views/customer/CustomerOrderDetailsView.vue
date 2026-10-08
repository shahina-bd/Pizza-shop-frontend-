<template>
    <CustomerMaster>
        <section class="py-5 bg-light">
            <div class="container">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h3>Order Details</h3>

                    <router-link to="/customer/dashboard" class="btn btn-outline-secondary">
                        Back to Dashboard
                    </router-link>
                </div>

                <div v-if="isLoading" class="text-center py-5">
                    <div class="spinner-border text-primary"></div>
                    <p class="mt-2">Loading order...</p>
                </div>

                <div v-else-if="order" class="row">
                    <div class="col-lg-4">
                        <div class="card shadow-sm mb-4">
                            <div class="card-header">
                                <h5 class="mb-0">Order Summary</h5>
                            </div>

                            <div class="card-body">
                                <p><strong>Order No:</strong> #{{ order.id }}</p>
                                <p><strong>Total:</strong> ৳ {{ order.total }}</p>
                                <p><strong>Payment:</strong> {{ order.payment_status }}</p>
                                <p><strong>Status:</strong> {{ order.status }}</p>
                                <p><strong>Phone:</strong> {{ order.customer_phone }}</p>
                                <p><strong>Email:</strong> {{ order.customer_email }}</p>
                                <p><strong>Address:</strong> {{ order.shipping_address }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-8">
                        <div class="card shadow-sm">
                            <div class="card-header">
                                <h5 class="mb-0">Order Items</h5>
                            </div>

                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-bordered align-middle">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Product</th>
                                                <th>Price</th>
                                                <th>Qty</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr v-for="item in order.items" :key="item.id">
                                                <td>{{ item.product_name ?? item.product?.name }}</td>
                                                <td>৳ {{ item.price }}</td>
                                                <td>{{ item.quantity }}</td>
                                                <td>৳ {{ item.total }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div class="text-end">
                                    <p>Subtotal: ৳ {{ order.subtotal }}</p>
                                    <p>Shipping: ৳ {{ order.shipping_cost }}</p>
                                    <h5>Total: ৳ {{ order.total }}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-else class="alert alert-danger">
                    Order not found.
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

const route = useRoute()

const order = ref(null)
const isLoading = ref(false)

const loadOrder = async () => {
    isLoading.value = true

    try {
        const response = await api.get(`v1/customer/orders/${route.params.id}`)
        order.value = response.data.order
    } catch (error) {
        console.error('Order details error:', error)
        order.value = null
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    loadOrder()
})
</script>