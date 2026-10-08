<template>
    <ManagerMaster>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h4 class="mb-0">
                                <i class="fas fa-tachometer-alt me-2 text-success"></i>
                                Manager Dashboard
                            </h4>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="card bg-light border-0">
                                        <div class="card-body text-center">
                                            <h3 class="text-success mb-2">{{ totalProducts }}</h3>
                                            <p class="text-muted">Total Products</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="card bg-light border-0">
                                        <div class="card-body text-center">
                                            <h3 class="text-success mb-2">{{ totalOrders }}</h3>
                                            <p class="text-muted">Total Orders</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="alert alert-info mt-4">
                                <i class="fas fa-info-circle me-2"></i>
                                Welcome to the Manager Portal. You can manage products and orders here.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </ManagerMaster>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ManagerMaster from '@/components/manager/ManagerMaster.vue'
import api from '@/utils/axios'

const totalProducts = ref(0)
const totalOrders = ref(0)

const loadStats = async () => {
    try {
        const response = await api.get('/v1/admin/stats')
        if (response.data) {
            totalProducts.value = response.data.total_products || 0
            totalOrders.value = response.data.total_orders || 0
        }
    } catch (error) {
        console.error('Stats loading error:', error)
    }
}

onMounted(() => {
    loadStats()
})
</script>
