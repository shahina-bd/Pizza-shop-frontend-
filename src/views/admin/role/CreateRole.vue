<template>
    <AdminMaster>
        <div class="container py-5">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card shadow-sm">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Create Role</h5>
                            <router-link to="/admin/roles" class="btn btn-outline-secondary btn-sm">
                                <i class="fas fa-list me-1"></i>
                                Role List
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
                                    <label class="form-label">Role Name</label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        v-model="form.name"
                                        placeholder="Enter role name"
                                    />
                                </div>

                                <div class="mb-3" v-if="permissions.length > 0">
                                    <label class="form-label">Assign Permissions</label>
                                    <div class="border rounded p-3" style="max-height: 300px; overflow-y: auto;">
                                        <div class="form-check" v-for="permission in permissions" :key="permission.id">
                                            <input
                                                class="form-check-input"
                                                type="checkbox"
                                                :id="`permission-${permission.id}`"
                                                :value="permission.id"
                                                v-model="form.permissions"
                                            >
                                            <label class="form-check-label" :for="`permission-${permission.id}`">
                                                {{ permission.name }}
                                                <span class="badge bg-light text-dark ms-2">{{ permission.guard_name }}</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <button class="btn btn-primary w-100" :disabled="isLoading">
                                    {{ isLoading ? 'Saving...' : 'Create Role' }}
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminMaster from '@/components/admin/AdminMaster.vue'
import api from '@/utils/axios'

const router = useRouter()

const form = ref({
    name: '',
    permissions: [],
    guard_name: 'web'
})
const isLoading = ref(false)
const errorMessage = ref('')
const message = ref('')

const permissions = ref([])
const loadingPermissions = ref(false)

const loadPermissions = async () => {
    loadingPermissions.value = true
    try {
        const response = await api.get('v1/permissions')
        permissions.value = response.data.data ?? response.data
    } catch (error) {
        console.error('Permissions loading error:', error)
        permissions.value = []
    } finally {
        loadingPermissions.value = false
    }
}

const handleSubmit = async () => {
    errorMessage.value = ''
    message.value = ''

    if (!form.value.name) {
        errorMessage.value = 'Role name is required.'
        return
    }

    isLoading.value = true

    try {
        const response = await api.post('v1/roles', {
            name: form.value.name,
            guard_name: form.value.guard_name,
            permissions: form.value.permissions
        })

        if (response.data.success) {
            message.value = response.data.message || 'Role created successfully.'
            form.value = { name: '', permissions: [], guard_name: 'web' }
            setTimeout(() => {
                router.push('/admin/roles')
            }, 1500)
        }
    } catch (error) {
        if (error.response?.data?.errors?.name) {
            errorMessage.value = error.response.data.errors.name[0]
        } else if (error.response?.data?.errors?.permissions) {
            errorMessage.value = error.response.data.errors.permissions[0]
        } else {
            errorMessage.value = error.response?.data?.message || 'Unable to create role. Please try again.'
        }
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    loadPermissions()
})
</script>
