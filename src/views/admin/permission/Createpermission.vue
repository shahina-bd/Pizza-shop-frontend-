<template>
    <AdminMaster>
        <div class="container py-5">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card shadow-sm">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Create Permission</h5>
                        <router-link to="/admin/permissions" class="btn btn-outline-secondary btn-sm">
                            <i class="fas fa-list me-1"></i>
                            Permission List
                        </router-link>
                    </div>
                        <div class="card-body">
                            <div v-if="message" class="alert alert-success" role="alert">
                                {{ message }}
                            </div>

                            <div v-if="errorMessage" class="alert alert-danger" role="alert">
                                {{ errorMessage }}
                            </div>

                            <form @submit.prevent="handleSubmit">
                                <div class="mb-3">
                                    <label class="form-label">Name</label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        v-model="form.name"
                                        placeholder="Enter name"
                                    />
                                </div>

                                <button class="btn btn-primary w-100" :disabled="isLoading">
                                    {{ isLoading ? 'Saving...' : 'Create Permission' }}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AdminMaster>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AdminMaster from '@/components/admin/AdminMaster.vue'
import api from '@/utils/axios'

const router = useRouter()

const form = ref({
    name: '',
})
const isLoading = ref(false)
const errorMessage = ref('')
const message = ref('')

const handleSubmit = async () => {
    errorMessage.value = ''
    message.value = ''

    if (!form.value.name) {
        errorMessage.value = 'Permission name is required.'
        return
    }

    isLoading.value = true

    try {
        const response = await api.post('v1/permissions', {
            name: form.value.name,
            guard_name: 'web'
        })

        if (response.data.success) {
            message.value = response.data.message || 'Permission created successfully.'
            form.value = { name: '' }
            // Optionally redirect after a delay
            setTimeout(() => {
                router.push('/admin/permissions')
            }, 1500)
        }
    } catch (error) {
        if (error.response?.data?.errors?.name) {
            errorMessage.value = error.response.data.errors.name[0]
        } else {
            errorMessage.value = error.response?.data?.message || 'Unable to create permission. Please try again.'
        }
    } finally {
        isLoading.value = false
    }
}
</script>
