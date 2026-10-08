<template>
    <AdminMaster>
        <div>
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <i class="fas fa-users-cog me-2 text-primary"></i>
                    Role Management
                </h2>

                <router-link to="/admin/roles/create" class="btn btn-primary">
                    <i class="fas fa-plus me-1"></i>
                    Add New Role
                </router-link>
            </div>

            <div class="card">
                <div class="card-body p-0">
                    <div class="text-center p-5" v-if="isLoading">
                        <div class="spinner-border text-primary"></div>
                        <p class="mt-2">Loading roles...</p>
                    </div>

                    <div class="table-responsive" v-else-if="roles.length > 0">
                        <table class="table table-hover mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th style="width: 80px;">ID</th>
                                    <th>Role Name</th>
                                    <th>Guard</th>
                                    <th>Permissions</th>
                                    <th>Created At</th>
                                    <th style="width: 150px;">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="role in roles" :key="role.id">
                                    <td>{{ role.id }}</td>
                                    <td>
                                        <strong>{{ role.name }}</strong>
                                    </td>
                                    <td>
                                        <span class="badge bg-secondary">{{ role.guard_name }}</span>
                                    </td>
                                    <td>
                                        <span class="badge bg-info me-1 mb-1"
                                            v-for="perm in role.permissions.slice(0, 3)"
                                            :key="perm.id">
                                            {{ perm.name }}
                                        </span>
                                        <span v-if="role.permissions.length > 3" class="text-muted">
                                            +{{ role.permissions.length - 3 }} more
                                        </span>
                                    </td>
                                    <td>{{ formatDate(role.created_at) }}</td>
                                    <td>
                                        <button class="btn btn-sm btn-info me-1" @click="openEditModal(role)"
                                            title="Edit">
                                            <i class="fas fa-edit"></i> Edit
                                        </button>
                                        <button class="btn btn-sm btn-danger" @click="deleteRole(role)"
                                            title="Delete">
                                            <i class="fas fa-trash"></i> Delete
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div v-else class="text-center p-5 text-muted">
                        <i class="fas fa-users-cog fa-3x mb-2 d-block"></i>
                        <p>No roles found</p>
                    </div>
                </div>
            </div>

            <!-- Edit Role Modal -->
            <div class="modal fade" id="editRoleModal" tabindex="-1" data-bs-backdrop="static">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-edit me-2"></i>
                                Edit Role
                            </h5>
                            <button type="button" class="btn-close" @click="closeEditModal"></button>
                        </div>
                        <div class="modal-body">
                            <div v-if="editError" class="alert alert-danger">{{ editError }}</div>
                            <div v-if="editSuccess" class="alert alert-success">{{ editSuccess }}</div>

                            <form @submit.prevent="updateRole">
                                <div class="mb-3">
                                    <label class="form-label">Role Name</label>
                                    <input type="text" class="form-control" v-model="editForm.name"
                                        placeholder="Enter role name" required>
                                </div>

                                <div class="mb-3" v-if="permissions.length > 0">
                                    <label class="form-label">Assign Permissions</label>
                                    <div class="border rounded p-3" style="max-height: 300px; overflow-y: auto;">
                                        <div class="form-check" v-for="permission in permissions" :key="permission.id">
                                            <input
                                                class="form-check-input"
                                                type="checkbox"
                                                :id="`edit-permission-${permission.id}`"
                                                :value="permission.id"
                                                v-model="editForm.permissions"
                                            >
                                            <label class="form-check-label" :for="`edit-permission-${permission.id}`">
                                                {{ permission.name }}
                                                <span class="badge bg-light text-dark ms-2">{{ permission.guard_name }}</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div class="modal-footer px-0 pb-0">
                                    <button type="button" class="btn btn-secondary" @click="closeEditModal">
                                        Cancel
                                    </button>
                                    <button type="submit" class="btn btn-primary" :disabled="isUpdating">
                                        <span v-if="isUpdating">Updating...</span>
                                        <span v-else>Update Role</span>
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

const roles = ref([])
const permissions = ref([])
const isLoading = ref(false)
const loadingPermissions = ref(false)
const isUpdating = ref(false)

// Edit state
const editForm = ref({
    id: null,
    name: '',
    permissions: []
})
const editSuccess = ref('')
const editError = ref('')
let editModalInstance = null

const loadRoles = async () => {
    isLoading.value = true
    try {
        const response = await api.get('v1/roles')
        roles.value = response.data.data ?? response.data
    } catch (error) {
        console.error('Roles loading error:', error)
        roles.value = []
    } finally {
        isLoading.value = false
    }
}

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

const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const deleteRole = async (role) => {
    const confirmed = confirm(`Are you sure you want to delete "${role.name}"?`)

    if (!confirmed) {
        return
    }

    try {
        await api.delete(`v1/roles/${role.id}`)
        alert('Role deleted successfully')
        await loadRoles()
    } catch (error) {
        console.error('Delete role error:', error)
        if (error.response?.data?.message) {
            alert(error.response.data.message)
        } else {
            alert('Delete failed')
        }
    }
}

const openEditModal = (role) => {
    editForm.value = {
        id: role.id,
        name: role.name,
        permissions: role.permissions?.map(p => p.id) || []
    }
    editError.value = ''
    editSuccess.value = ''

    const modalElement = document.getElementById('editRoleModal')
    if (modalElement) {
        editModalInstance = Modal.getOrCreateInstance(modalElement)
        editModalInstance.show()
    }
}

const closeEditModal = () => {
    const modalElement = document.getElementById('editRoleModal')
    if (modalElement) {
        const modal = Modal.getInstance(modalElement)
        if (modal) {
            modal.hide()
        }
    }
}

const updateRole = async () => {
    if (!editForm.value.name.trim()) {
        editError.value = 'Role name is required.'
        return
    }

    isUpdating.value = true
    editError.value = ''
    editSuccess.value = ''

    try {
        await api.put(`v1/roles/${editForm.value.id}`, {
            name: editForm.value.name,
            guard_name: 'web',
            permissions: editForm.value.permissions
        })

        editSuccess.value = 'Role updated successfully!'
        setTimeout(() => {
            closeEditModal()
            loadRoles()
        }, 1000)
    } catch (error) {
        if (error.response?.data?.errors?.name) {
            editError.value = error.response.data.errors.name[0]
        } else {
            editError.value = error.response?.data?.message || 'Failed to update role.'
        }
    } finally {
        isUpdating.value = false
    }
}

onMounted(() => {
    loadPermissions()
    loadRoles()
})
</script>
