<template>
    <AdminMaster>
        <div class="container-fluid">
            <div class="row mb-4">
                <div class="col-12">
                    <h2 class="mb-0">
                        <i class="fas fa-users me-2 text-primary"></i>
                        Customer Report
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
                            <h6 class="card-title">Total Customers</h6>
                            <h3 class="mb-0">{{ totalCustomers }}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-success text-white">
                        <div class="card-body">
                            <h6 class="card-title">New Customers</h6>
                            <h3 class="mb-0">{{ newCustomers }}</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-info text-white">
                        <div class="card-body">
                            <h6 class="card-title">Repeat Customers</h6>
                            <h3 class="mb-0">{{ repeatCustomers }}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row mt-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Top Customers</h5>
                        </div>
                        <div class="card-body">
                            <div v-if="isLoading" class="text-center p-5">
                                <div class="spinner-border text-primary"></div>
                                <p class="mt-2">Loading report...</p>
                            </div>
                            <div v-else-if="customerData.length > 0" class="table-responsive">
                                <table class="table table-hover">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Customer Name</th>
                                            <th>Email</th>
                                            <th>Mobile</th>
                                            <th>Orders</th>
                                            <th>Total Spent</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="customer in customerData" :key="customer.id">
                                            <td>{{ customer.name }}</td>
                                            <td>{{ customer.email }}</td>
                                            <td>{{ customer.mobile }}</td>
                                            <td>{{ customer.order_count }}</td>
                                            <td>৳{{ customer.total_spent.toLocaleString() }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div v-else class="text-center p-5 text-muted">
                                <p>No customer data available for the selected period</p>
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
const totalCustomers = ref(0)
const newCustomers = ref(0)
const repeatCustomers = ref(0)
const customerData = ref([])

const filters = ref({
    startDate: '',
    endDate: '',
    reportType: 'daily'
})

const loadCustomerReport = async () => {
    isLoading.value = true
    try {
        const response = await api.get('v1/admin/reports/customers', {
            params: {
                start_date: filters.value.startDate,
                end_date: filters.value.endDate,
                type: filters.value.reportType
            }
        })

        if (response.data) {
            totalCustomers.value = response.data.total_customers || 0
            newCustomers.value = response.data.new_customers || 0
            repeatCustomers.value = response.data.repeat_customers || 0
            customerData.value = response.data.data || []
        }
    } catch (error) {
        console.error('Customer report error:', error)
        alert('Failed to load customer report')
    } finally {
        isLoading.value = false
    }
}

const handleFilterApplied = (filterData) => {
    filters.value = filterData
    loadCustomerReport()
}

const handleExportPDF = (filterData) => {
    alert('PDF export feature coming soon')
}

onMounted(() => {
    loadCustomerReport()
})
</script>
