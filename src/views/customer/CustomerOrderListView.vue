<template>
    <CustomerMaster>
        <section class="py-5 bg-light">
            <div class="container">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h3 class="mb-0">My Orders</h3>

                    <router-link to="/" class="btn btn-outline-primary">
                        Continue Shopping
                    </router-link>
                </div>

                <div class="card shadow-sm">
                    <div class="card-body">
                        <div v-if="isLoading" class="text-center py-5">
                            <div class="spinner-border text-primary"></div>
                            <p class="mt-2">Loading orders...</p>
                        </div>

                        <div v-else-if="orders.length === 0" class="alert alert-info mb-0">
                            You have no orders yet.
                        </div>

                        <div v-else class="table-responsive">
                            <table class="table table-bordered align-middle mb-0">
                                <thead class="table-light">
                                    <tr>
                                        <th>Order No</th>
                                        <th>Total</th>
                                        <th>Payment Status</th>
                                        <th>Order Status</th>
                                        <th>Date</th>
                                        <th width="100">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr v-for="order in orders" :key="order.id">
                                        <td>#{{ order.id }}</td>
                                        <td>৳ {{ order.total }}</td>
                                        <td>
                                            <span class="badge bg-info">
                                                {{ order.payment_status }}
                                            </span>
                                        </td>
                                        <td>
                                            <span class="badge bg-secondary">
                                                {{ order.status }}
                                            </span>
                                        </td>
                                        <td>{{ formatDate(order.created_at) }}</td>
                                        <td>
                                            <router-link class="btn btn-sm btn-primary"
                                                :to="{ name: 'customer.orders.show', params: { id: order.id } }">
                                                View
                                            </router-link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </CustomerMaster>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/axios'
import CustomerMaster from '@/components/customer/CustomerMaster.vue'

const orders = ref([])
const isLoading = ref(false)

const loadOrders = async () => {
    isLoading.value = true

    try {
        const response = await api.get('v1/customer/orders')
        orders.value = response.data.data ?? response.data
    } catch (error) {
        console.error('Order loading error:', error)
        orders.value = []
    } finally {
        isLoading.value = false
    }
}

const formatDate = (date) => {
    return new Date(date).toLocaleDateString()
}

onMounted(() => {
    loadOrders()
})
</script>