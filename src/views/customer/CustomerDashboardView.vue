<template>
    <CustomerMaster>
        <section class="py-5 bg-light">
            <div class="container">
                <h3 class="mb-4">Customer Dashboard</h3>

                <div class="row">
                    <div class="col-lg-4">
                        <div class="card shadow-sm mb-4">
                            <div class="card-header">
                                <h5 class="mb-0">Profile Information</h5>
                            </div>

                            <div class="card-body">
                                <p><strong>Name:</strong> {{ customerAuthStore.user?.name }}</p>
                                <p><strong>Mobile:</strong> {{ customerAuthStore.user?.mobile }}</p>
                                <p><strong>Email:</strong> {{ customerAuthStore.user?.email ?? 'N/A' }}</p>
                                <p><strong>Address:</strong> {{ customerAuthStore.user?.address ?? 'N/A' }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-8">
                        <div class="card shadow-sm">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">My Orders</h5>
                            </div>

                            <div class="card-body">
                                <div v-if="isLoading" class="text-center py-4">
                                    <div class="spinner-border text-primary"></div>
                                    <p class="mt-2">Loading orders...</p>
                                </div>

                                <div v-else-if="orders.length === 0" class="alert alert-info">
                                    You have no orders yet.
                                </div>

                                <div v-else class="table-responsive">
                                    <table class="table table-bordered align-middle">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Order No</th>
                                                <th>Total</th>
                                                <th>Payment</th>
                                                <th>Status</th>
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
                </div>
            </div>
        </section>
    </CustomerMaster>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/axios'
import CustomerMaster from '@/components/customer/CustomerMaster.vue'
import { useCustomerAuthStore } from '@/stores/customerAuth'

const customerAuthStore = useCustomerAuthStore()

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