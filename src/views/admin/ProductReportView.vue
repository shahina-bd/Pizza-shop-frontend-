<template>
    <AdminMaster>
        <div class="container-fluid">
            <div class="row mb-4">
                <div class="col-12">
                    <h2 class="mb-0">
                        <i class="fas fa-box me-2 text-primary"></i>
                        Product Report
                    </h2>
                </div>
            </div>

            <ReportFilter
                @filter-applied="handleFilterApplied"
                @export-pdf="handleExportPDF"
            />

            <div class="row mt-4">
                <div class="col-md-4">
                    <div class="card bg-primary text-white">
                        <div class="card-body">
                            <h6 class="card-title">Total Products</h6>
                            <h3 class="mb-0">{{ totalProducts }}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-warning text-white">
                        <div class="card-body">
                            <h6 class="card-title">Low Stock Items</h6>
                            <h3 class="mb-0">{{ lowStockCount }}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-danger text-white">
                        <div class="card-body">
                            <h6 class="card-title">Out of Stock</h6>
                            <h3 class="mb-0">{{ outOfStockCount }}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mt-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Top Selling Products</h5>
                        </div>
                        <div class="card-body">
                            <div v-if="isLoading" class="text-center p-5">
                                <div class="spinner-border text-primary"></div>
                                <p class="mt-2">Loading report...</p>
                            </div>
                            <div v-else-if="productData.length > 0" class="table-responsive">
                                <table class="table table-hover">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Product Name</th>
                                            <th>Category</th>
                                            <th>Stock</th>
                                            <th>Sales</th>
                                            <th>Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="product in productData" :key="product.id">
                                            <td>{{ product.name }}</td>
                                            <td>{{ product.category }}</td>
                                            <td>
                                                <span :class="getStockClass(product.stock)">
                                                    {{ product.stock }}
                                                </span>
                                            </td>
                                            <td>{{ product.sales_count }}</td>
                                            <td>৳{{ product.revenue.toLocaleString() }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="text-center p-5 text-muted">
                                <p>No product data available for the selected period</p>
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
const totalProducts = ref(0)
const lowStockCount = ref(0)
const outOfStockCount = ref(0)
const productData = ref([])

const filters = ref({
    startDate: '',
    endDate: '',
    reportType: 'daily'
})

const getStockClass = (stock) => {
    if (stock === 0) return 'badge bg-danger'
    if (stock < 10) return 'badge bg-warning'
    return 'badge bg-success'
}

const loadProductReport = async () => {
    isLoading.value = true
    try {
        const response = await api.get('v1/admin/reports/pizzas', {
            params: {
                start_date: filters.value.startDate,
                end_date: filters.value.endDate,
                type: filters.value.reportType
            }
        })

        if (response.data) {
            totalProducts.value = response.data.total_products || 0
            lowStockCount.value = response.data.low_stock_count || 0
            outOfStockCount.value = response.data.out_of_stock_count || 0
            productData.value = response.data.data || []
        }
    } catch (error) {
        console.error('Product report error:', error)
        alert('Failed to load product report')
    } finally {
        isLoading.value = false
    }
}

const handleFilterApplied = (filterData) => {
    filters.value = filterData
    loadProductReport()
}

const handleExportPDF = (filterData) => {
    alert('PDF export feature coming soon')
}

onMounted(() => {
    loadProductReport()
})
</script>
