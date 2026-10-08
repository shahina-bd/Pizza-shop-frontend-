<template>
    <div class="card">
        <div class="card-header bg-light">
            <div class="row align-items-center">
                <div class="col-md-8">
                    <h5 class="mb-0">
                        <i class="fas fa-calendar-alt me-2"></i>
                        Report Filters
                    </h5>
                </div>
                <div class="col-md-4 text-end">
                    <button @click="exportToPDF" class="btn btn-sm btn-danger" :disabled="isExporting">
                        <i class="fas fa-file-pdf me-1"></i>
                        {{ isExporting ? 'Exporting...' : 'Export PDF' }}
                    </button>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-3">
                    <label class="form-label">Start Date</label>
                    <input type="date" class="form-control" v-model="startDate" @change="applyFilters">
                </div>
                <div class="col-md-3">
                    <label class="form-label">End Date</label>
                    <input type="date" class="form-control" v-model="endDate" @change="applyFilters">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Report Type</label>
                    <select class="form-select" v-model="reportType" @change="applyFilters">
                        <option value="daily">Daily</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <label class="form-label">&nbsp;</label>
                    <button @click="resetFilters" class="btn btn-outline-secondary w-100">
                        <i class="fas fa-redo me-1"></i>
                        Reset
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
    startDateProp: String,
    endDateProp: String,
    reportTypeProp: {
        type: String,
        default: 'daily'
    }
})

const emit = defineEmits(['filter-applied', 'export-pdf'])

const startDate = ref('')
const endDate = ref('')
const reportType = ref(props.reportTypeProp)
const isExporting = ref(false)

const getDefaultDates = () => {
    const today = new Date()
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    
    endDate.value = today.toISOString().split('T')[0]
    startDate.value = lastMonth.toISOString().split('T')[0]
}

const applyFilters = () => {
    if (!startDate.value || !endDate.value) {
        alert('Please select both start and end dates')
        return
    }

    emit('filter-applied', {
        startDate: startDate.value,
        endDate: endDate.value,
        reportType: reportType.value
    })
}

const resetFilters = () => {
    getDefaultDates()
    reportType.value = 'daily'
    applyFilters()
}

const exportToPDF = async () => {
    isExporting.value = true
    try {
        emit('export-pdf', {
            startDate: startDate.value,
            endDate: endDate.value,
            reportType: reportType.value
        })
    } finally {
        isExporting.value = false
    }
}

onMounted(() => {
    if (props.startDateProp && props.endDateProp) {
        startDate.value = props.startDateProp
        endDate.value = props.endDateProp
    } else {
        getDefaultDates()
    }
})
</script>
