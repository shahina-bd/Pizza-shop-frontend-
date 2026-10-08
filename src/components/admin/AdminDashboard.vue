<template>
    <div>
        <h2 class="mb-4">
            <i class="fas fa-tachometer-alt me-2 text-primary"></i>
            Dashboard
        </h2>

        <!-- Stats Row -->
        <div class="row">
            <div class="col-md-3 mb-4">
                <div class="card bg-primary text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="card-title">Total Orders</h6>
                                <h2 class="mb-0">{{ stats.total_orders || 0 }}</h2>
                            </div>
                            <i class="fas fa-shopping-cart fa-2x opacity-50"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-3 mb-4">
                <div class="card bg-success text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="card-title">Total Users</h6>
                                <h2 class="mb-0">{{ stats.total_users || 0 }}</h2>
                            </div>
                            <i class="fas fa-users fa-2x opacity-50"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-3 mb-4">
                <div class="card bg-info text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="card-title">Total Products</h6>
                                <h2 class="mb-0">{{ stats.total_products || 0 }}</h2>
                            </div>
                            <i class="fas fa-box fa-2x opacity-50"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-3 mb-4">
                <div class="card bg-warning text-white">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="card-title">Total Revenue</h6>
                                <h2 class="mb-0">৳{{ stats.total_revenue || 0 }}</h2>
                            </div>
                            <i class="fas fa-chart-line fa-2x opacity-50"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Management Row: Permissions, Roles, Create Role -->
        <div class="row">
            <div class="col-md-4 mb-4">
                <router-link to="/admin/permissions" class="text-decoration-none">
                    <div class="card bg-info text-white hover-card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="card-title">Permissions</h6>
                                    <h2 class="mb-0">{{ stats.total_permissions || 0 }}</h2>
                                </div>
                                <i class="fas fa-key fa-2x opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>

            <div class="col-md-4 mb-4">
                <router-link to="/admin/roles" class="text-decoration-none">
                    <div class="card bg-success text-white hover-card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="card-title">Roles</h6>
                                    <h2 class="mb-0">{{ stats.total_roles || 0 }}</h2>
                                </div>
                                <i class="fas fa-users-cog fa-2x opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>

            <div class="col-md-4 mb-4">
                <router-link to="/admin/roles/create" class="text-decoration-none">
                    <div class="card bg-warning text-white hover-card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="card-title">Create New Role</h6>
                                    <p class="mb-0 mt-2">
                                        <i class="fas fa-plus-circle me-2"></i>
                                        Add Role with Permissions
                                    </p>
                                </div>
                                <i class="fas fa-user-plus fa-2x opacity-50"></i>
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>

        <!-- Recent Orders Card -->
        <div class="card mt-3">
            <div class="card-header bg-white">
                <h5 class="mb-0">
                    <i class="fas fa-clock me-2 text-primary"></i>
                    Recent Orders
                </h5>
            </div>
            <div class="card-body p-0">
                <div v-if="loading" class="text-center p-5">
                    <div class="spinner-border text-primary"></div>
                </div>

                <div v-else-if="recentOrders.length === 0" class="text-center p-5 text-muted">
                    <i class="fas fa-inbox fa-3x mb-2 d-block"></i>
                    <p>No orders found</p>
                </div>

                <table v-else class="table table-hover mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>Order ID</th>
                            <th>Customer Name</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="order in recentOrders" :key="order.id">
                            <td>#{{ order.id }}</td>
                            <td>{{ order.user?.name || 'Guest' }}</td>
                            <td>৳{{ order.total }}</td>
                            <td>
                                <span :class="getStatusClass(order.status)">
                                    {{ getStatusText(order.status) }}
                                </span>
                            </td>
                            <td>{{ formatDate(order.created_at) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/axios'

// State Variables
const stats = ref({
    total_orders: 0,
    total_users: 0,
    total_products: 0,
    total_revenue: 0,
    total_permissions: 0,
    total_roles: 0
})
const recentOrders = ref([])
const loading = ref(true)

// Get CSS class based on status
const getStatusClass = (status) => {
    const classes = {
        pending: 'badge bg-warning',
        processing: 'badge bg-info',
        shipped: 'badge bg-primary',
        delivered: 'badge bg-success',
        cancelled: 'badge bg-danger'
    }
    return classes[status] || 'badge bg-secondary'
}

// Get readable text based on status
const getStatusText = (status) => {
    const texts = {
        pending: 'Pending',
        processing: 'Processing',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
    }
    return texts[status] || status.charAt(0).toUpperCase() + status.slice(1)
}

// Date formatter
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

// Load Dashboard Data
const loadDashboardData = async () => {
    loading.value = true

    // Reset stats to defaults
    stats.value = {
        total_orders: 0,
        total_users: 0,
        total_products: 0,
        total_revenue: 0,
        total_permissions: 0,
        total_roles: 0
    }

    try {
        // Attempt to load admin stats (if endpoint exists)
        try {
            const statsRes = await api.get('/v1/admin/stats')
            if (statsRes.data && typeof statsRes.data === 'object') {
                stats.value = { ...stats.value, ...statsRes.data }
            }
        } catch (e) {
            // Admin stats endpoint may not exist; ignore
        }

        // Attempt to load recent orders (if endpoint exists)
        try {
            const ordersRes = await api.get('/v1/admin/recent-orders')
            recentOrders.value = ordersRes.data || []
        } catch (e) {
            recentOrders.value = []
        }

        // Load roles count
        try {
            const rolesRes = await api.get('v1/roles')
            const rolesData = rolesRes.data?.data ?? rolesRes.data ?? []
            stats.value.total_roles = Array.isArray(rolesData) ? rolesData.length : 0
        } catch (e) {
            console.error('Failed to load roles count:', e)
        }

        // Load permissions count
        try {
            const permsRes = await api.get('v1/permissions')
            const permsData = permsRes.data?.data ?? permsRes.data ?? []
            stats.value.total_permissions = Array.isArray(permsData) ? permsData.length : 0
        } catch (e) {
            console.error('Failed to load permissions count:', e)
        }

    } catch (e) {
        console.error('Dashboard load error:', e)
    } finally {
        loading.value = false
    }
}

// Fetch data on component mount
onMounted(() => {
    loadDashboardData()
})
</script>

<style scoped>
.hover-card {
    transition: transform 0.2s, box-shadow 0.2s;
    border: none;
}

.hover-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
}
</style>
