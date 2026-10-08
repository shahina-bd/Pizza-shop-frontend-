<template>
    <AdminMaster>
        <div>
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <i class="fas fa-key me-2 text-primary"></i>
                    Permission Management
                </h2>

                <router-link to="/admin/permissions/create" class="btn btn-primary">
                    <i class="fas fa-plus me-1"></i>
                    Add New Permission
                </router-link>
            </div>

            <div class="card">
                <div class="card-body p-0">
                    <div class="text-center p-5" v-if="isLoading">
                        <div class="spinner-border text-primary"></div>
                        <p class="mt-2">Loading permissions...</p>
                    </div>

                    <div class="table-responsive" v-else-if="permissions.length > 0">
                        <table class="table table-hover mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th style="width: 80px;">ID</th>
                                    <th>Permission Name</th>
                                    <th>Guard</th>
                                    <th>Created At</th>
                                    <th style="width: 150px;">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="permission in permissions" :key="permission.id">
                                    <td>{{ permission.id }}</td>
                                    <td>
                                        <strong>{{ permission.name }}</strong>
                                    </td>
                                    <td>
                                        <span class="badge bg-secondary">{{ permission.guard_name }}</span>
                                    </td>
                                    <td>{{ formatDate(permission.created_at) }}</td>
                                    <td>
                                        <button class="btn btn-sm btn-info me-1" @click="openEditModal(permission)"
                                            title="Edit">
                                            <i class="fas fa-edit"></i> Edit
                                        </button>
                                        <button class="btn btn-sm btn-danger" @click="deletePermission(permission)"
                                            title="Delete">
                                            <i class="fas fa-trash"></i> Delete
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div v-else class="text-center p-5 text-muted">
                        <i class="fas fa-key fa-3x mb-2 d-block"></i>
                        <p>No permissions found</p>
                    </div>
                </div>
            </div>

            <!-- Edit Permission Modal -->
            <div class="modal fade" id="editPermissionModal" tabindex="-1" data-bs-backdrop="static">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-edit me-2"></i>
                                Edit Permission
                            </h5>
                            <button type="button" class="btn-close" @click="closeEditModal"></button>
                        </div>
                        <div class="modal-body">
                            <div v-if="editError" class="alert alert-danger">{{ editError }}</div>
                            <div v-if="editSuccess" class="alert alert-success">{{ editSuccess }}</div>

                            <form @submit.prevent="updatePermission">
                                <div class="mb-3">
                                    <label class="form-label">Permission Name</label>
                                    <input type="text" class="form-control" v-model="editForm.name"
                                        placeholder="Enter permission name" required>
                                </div>

                                <div class="modal-footer px-0 pb-0">
                                    <button type="button" class="btn btn-secondary" @click="closeEditModal">
                                        Cancel
                                    </button>
                                    <button type="submit" class="btn btn-primary" :disabled="isUpdating">
                                        <span v-if="isUpdating">Updating...</span>
                                        <span v-else>Update Permission</span>
                                    </button>
                                </div>
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
import { Modal } from 'bootstrap'
import api from '@/utils/axios'
import AdminMaster from '@/components/admin/AdminMaster.vue'

const permissions = ref([])
const isLoading = ref(false)
const isUpdating = ref(false)

// Edit state
const editForm = ref({
    id: null,
    name: ''
})
const editSuccess = ref('')
const editError = ref('')
let editModalInstance = null

const loadPermissions = async () => {
    isLoading.value = true

    try {
        const response = await api.get('v1/permissions')
        permissions.value = response.data.data ?? response.data
    } catch (error) {
        console.error('Permissions loading error:', error)
        permissions.value = []
    } finally {
        isLoading.value = false
    }
}

const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const deletePermission = async (permission) => {
    const confirmed = confirm(`Are you sure you want to delete "${permission.name}"?`)

    if (!confirmed) {
        return
    }

    try {
        await api.delete(`v1/permissions/${permission.id}`)
        alert('Permission deleted successfully')
        await loadPermissions()
    } catch (error) {
        console.error('Delete permission error:', error)

        if (error.response?.data?.message) {
            alert(error.response.data.message)
        } else {
            alert('Delete failed')
        }
    }
}

const openEditModal = (permission) => {
    editForm.value = {
        id: permission.id,
        name: permission.name
    }
    editError.value = ''
    editSuccess.value = ''

    const modalElement = document.getElementById('editPermissionModal')
    if (modalElement) {
        editModalInstance = Modal.getOrCreateInstance(modalElement)
        editModalInstance.show()
    }
}

const closeEditModal = () => {
    const modalElement = document.getElementById('editPermissionModal')
    if (modalElement) {
        const modal = Modal.getInstance(modalElement)
        if (modal) {
            modal.hide()
        }
    }
}

const updatePermission = async () => {
    if (!editForm.value.name.trim()) {
        editError.value = 'Permission name is required.'
        return
    }

    isUpdating.value = true
    editError.value = ''
    editSuccess.value = ''

    try {
        await api.put(`v1/permissions/${editForm.value.id}`, {
            name: editForm.value.name,
            guard_name: 'web'
        })

        editSuccess.value = 'Permission updated successfully!'
        setTimeout(() => {
            closeEditModal()
            loadPermissions()
        }, 1000)
    } catch (error) {
        if (error.response?.data?.errors?.name) {
            editError.value = error.response.data.errors.name[0]
        } else {
            editError.value = error.response?.data?.message || 'Failed to update permission.'
        }
    } finally {
        isUpdating.value = false
    }
}

onMounted(() => {
    loadPermissions()
})
</script>
