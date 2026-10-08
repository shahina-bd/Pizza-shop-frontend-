<template>
    <AdminMaster>
        <div class="container-fluid">
            <div class="row mb-4">
                <div class="col-12">
                    <h2 class="mb-0">
                        <i class="fas fa-shopping-cart me-2 text-primary"></i>
                        Order Report
                    </h2>
                </div>
            </div>

            <ReportFilter
                @filter-applied="handleFilterApplied"
                @export-pdf="handleExportPDF"
            />

            <div class="row mt-4">
                <div class="col-md-3">
                    <div class="card bg-primary text-white">
                        <div class="card-body">
                            <h6 class="card-title">Total Orders</h6>
                            <h3 class="mb-0">{{ totalOrders }}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-success text-white">
                        <div class="card-body">
                            <h6 class="card-title">Completed</h6>
                            <h3 class="mb-0">{{ completedOrders }}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-warning text-white">
                        <div class="card-body">
                            <h6 class="card-title">Pending</h6>
                            <h3 class="mb-0">{{ pendingOrders }}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-danger text-white">
                        <div class="card-body">
                            <h6 class="card-title">Cancelled</h6>
                            <h3 class="mb-0">{{ cancelledOrders }}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mt-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Order Details</h5>
                        </div>
                        <div class="card-body">
                            <div v-if="isLoading" class="text-center p-5">
                                <div class="spinner-border text-primary"></div>
                                <p class="mt-2">Loading report...</p>
                            </div>
                            <div v-else-if="orderData.length > 0" class="table-responsive">
                                <table class="table table-hover">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th>Payment</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="order in orderData" :key="order.id">
                                            <td>#{{ order.id }}</td>
                                            <td>{{ order.user?.name || 'Guest' }}</td>
                                            <td>৳{{ order.total.toLocaleString() }}</td>
                                            <td>
                                                <span :class="getStatusClass(order.status)">
                                                    {{ order.status }}
                                                </span>
                                            </td>
                                            <td>
                                                <span :class="getPaymentClass(order.payment_status)">
                                                    {{ order.payment_status }}
                                                </span>
                                            </td>
                                            <td>{{ formatDate(order.created_at) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="text-center p-5 text-muted">
                                <p>No order data available for the selected period</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminMaster>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminMaster from '@/components/admin/AdminMaster.vue'
import ReportFilter from '@/components/admin/ReportFilter.vue'
import api from '@/utils/axios'

const isLoading = ref(false)
const totalOrders = ref(0)
const completedOrders = ref(0)
const pendingOrders = ref(0)
const cancelledOrders = ref(0)
const orderData = ref([])

const filters = ref({
    startDate: '',
    endDate: '',
    reportType: 'daily'
})

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const getStatusClass = (status) => {
    const statusMap = {
        'completed': 'badge bg-success',
        'pending': 'badge bg-warning',
        'cancelled': 'badge bg-danger',
        'shipped': 'badge bg-info'
    }
    return statusMap[status?.toLowerCase()] || 'badge bg-secondary'
}

const getPaymentClass = (status) => {
    const statusMap = {
        'paid': 'badge bg-success',
        'pending': 'badge bg-warning',
        'failed': 'badge bg-danger'
    }
    return statusMap[status?.toLowerCase()] || 'badge bg-secondary'
}

const loadOrderReport = async () => {
    isLoading.value = true
    try {
        const response = await api.get('v1/admin/reports/orders', {
            params: {
                start_date: filters.value.startDate,
                end_date: filters.value.endDate,
                type: filters.value.reportType
            }
        })

        if (response.data) {
            totalOrders.value = response.data.total_orders || 0
            completedOrders.value = response.data.completed_orders || 0
            pendingOrders.value = response.data.pending_orders || 0
            cancelledOrders.value = response.data.cancelled_orders || 0
            orderData.value = response.data.data || []
        }
    } catch (error) {
        console.error('Order report error:', error)
        alert('Failed to load order report')
    } finally {
        isLoading.value = false
    }
}

const handleFilterApplied = (filterData) => {
    filters.value = filterData
    loadOrderReport()
}

const handleExportPDF = (filterData) => {
    alert('PDF export feature coming soon')
}

onMounted(() => {
    loadOrderReport()
})
</script>
