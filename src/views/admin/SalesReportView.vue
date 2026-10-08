<template>
    <AdminMaster>
        <div class="container-fluid">
            <div class="row mb-4">
                <div class="col-12">
                    <h2 class="mb-0">
                        <i class="fas fa-chart-line me-2 text-primary"></i>
                        Sales Report
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
                            <h6 class="card-title">Total Sales</h6>
                            <h3 class="mb-0">৳{{ totalSales.toLocaleString() }}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-success text-white">
                        <div class="card-body">
                            <h6 class="card-title">Total Orders</h6>
                            <h3 class="mb-0">{{ totalOrders }}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-info text-white">
                        <div class="card-body">
                            <h6 class="card-title">Average Order Value</h6>
                            <h3 class="mb-0">৳{{ avgOrderValue.toLocaleString() }}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card bg-warning text-white">
                        <div class="card-body">
                            <h6 class="card-title">Total Customers</h6>
                            <h3 class="mb-0">{{ totalCustomers }}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mt-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Sales Breakdown</h5>
                        </div>
                        <div class="card-body">
                            <div v-if="isLoading" class="text-center p-5">
                                <div class="spinner-border text-primary"></div>
                                <p class="mt-2">Loading report...</p>
                            </div>
                            <div v-else-if="salesData.length > 0" class="table-responsive">
                                <table class="table table-hover">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Date</th>
                                            <th>Orders</th>
                                            <th>Revenue</th>
                                            <th>Avg Order Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="row in salesData" :key="row.date">
                                            <td>{{ formatDate(row.date) }}</td>
                                            <td>{{ row.orders }}</td>
                                            <td>৳{{ row.revenue.toLocaleString() }}</td>
                                            <td>৳{{ (row.revenue / row.orders).toLocaleString() }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="text-center p-5 text-muted">
                                <p>No sales data available for the selected period</p>
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
const totalSales = ref(0)
const totalOrders = ref(0)
const totalCustomers = ref(0)
const avgOrderValue = ref(0)
const salesData = ref([])

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

const loadSalesReport = async () => {
    isLoading.value = true
    try {
        const response = await api.get('v1/admin/reports/sales', {
            params: {
                start_date: filters.value.startDate,
                end_date: filters.value.endDate,
                type: filters.value.reportType
            }
        })

        if (response.data) {
            totalSales.value = response.data.total_sales || 0
            totalOrders.value = response.data.total_orders || 0
            totalCustomers.value = response.data.total_customers || 0
            avgOrderValue.value = totalOrders.value > 0 ? totalSales.value / totalOrders.value : 0
            salesData.value = response.data.data || []
        }
    } catch (error) {
        console.error('Sales report error:', error)
        alert('Failed to load sales report')
    } finally {
        isLoading.value = false
    }
}

const handleFilterApplied = (filterData) => {
    filters.value = filterData
    loadSalesReport()
}

const handleExportPDF = (filterData) => {
    // PDF export will be implemented with jsPDF
    alert('PDF export feature coming soon')
}

onMounted(() => {
    loadSalesReport()
})
</script>
