<template>
    <AdminMaster>
        <div>
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <i class="fas fa-users me-2 text-primary"></i>
                    User Management
                </h2>
                <button class="btn btn-outline-secondary btn-sm" @click="loadUsers" :disabled="isLoading">
                    <i class="fas fa-sync-alt me-1"></i>
                    Refresh
                </button>
            </div>

            <div class="card">
                <div class="card-body p-0">
                    <div class="text-center p-5" v-if="isLoading">
                        <div class="spinner-border text-primary"></div>
                        <p class="mt-2">Loading users...</p>
                    </div>

                    <div class="table-responsive" v-else-if="users.length > 0">
                        <table class="table table-hover mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th style="width: 80px;">ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Mobile</th>
                                    <th>Role</th>
                                    <th>Created</th>
                                    <th style="width: 150px;">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="user in users" :key="user.id">
                                    <td>{{ user.id }}</td>
                                    <td>
                                        <strong>{{ user.name }}</strong>
                                    </td>
                                    <td>{{ user.email || 'N/A' }}</td>
                                    <td>{{ user.mobile }}</td>
                                    <td>
                                        <span v-if="user.roles && user.roles.length > 0">
                                            <span class="badge bg-primary me-1"
                                                v-for="role in user.roles.slice(0, 2)"
                                                :key="role.id">
                                                {{ role.name }}
                                            </span>
                                            <span v-if="user.roles.length > 2" class="text-muted small">
                                                +{{ user.roles.length - 2 }} more
                                            </span>
                                        </span>
                                        <span v-else class="badge bg-secondary">No role</span>
                                    </td>
                                    <td>{{ formatDate(user.created_at) }}</td>
                                    <td>
                                        <button class="btn btn-sm btn-info me-1" @click="openAssignModal(user)"
                                            title="Assign Role">
                                            <i class="fas fa-user-tag"></i> Role
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div v-else class="text-center p-5 text-muted">
                        <i class="fas fa-users fa-3x mb-2 d-block"></i>
                        <p v-if="!errorMessage">{{ users.length === 0 ? 'No users found. Create a user first.' : 'No users found' }}</p>
                        <p v-else class="text-danger">{{ errorMessage }}</p>
                        <button class="btn btn-sm btn-primary mt-2" @click="loadUsers" :disabled="isLoading">
                            <i class="fas fa-sync-alt me-1"></i> Retry
                        </button>
                    </div>
                </div>
            </div>

            <!-- Assign Role Modal -->
            <div class="modal fade" id="assignRoleModal" tabindex="-1" data-bs-backdrop="static">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-user-tag me-2"></i>
                                Assign Role to {{ selectedUser?.name }}
                            </h5>
                            <button type="button" class="btn-close" @click="closeModal"></button>
                        </div>
                        <div class="modal-body">
                            <div v-if="modalError" class="alert alert-danger">{{ modalError }}</div>
                            <div v-if="modalSuccess" class="alert alert-success">{{ modalSuccess }}</div>

                            <div v-if="loadingRoles" class="text-center py-3">
                                <div class="spinner-border spinner-border-sm text-primary"></div>
                                <p class="mt-2 mb-0">Loading roles...</p>
                            </div>

                            <form v-else @submit.prevent="assignRole">
                                <div class="mb-3">
                                    <label class="form-label">Current Roles</label>
                                    <div class="mb-2">
                                        <span class="badge bg-primary me-1 mb-1"
                                            v-for="role in selectedUser?.roles || []"
                                            :key="role.id">
                                            {{ role.name }}
                                        </span>
                                        <span v-if="!selectedUser?.roles || selectedUser.roles.length === 0"
                                            class="text-muted">
                                            None assigned
                                        </span>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Select Role to Assign</label>
                                    <select class="form-select" v-model="selectedRole" required>
                                        <option value="">Choose a role...</option>
                                        <option v-for="role in roles" :key="role.id" :value="role.name">
                                            {{ role.name }}
                                            <span class="text-muted ms-2">({{ role.guard_name }})</span>
                                        </option>
                                    </select>
                                    <small class="text-muted" v-if="roles.length === 0">
                                        No roles available. Create roles first.
                                    </small>
                                </div>

                                <div class="modal-footer px-0 pb-0">
                                    <button type="button" class="btn btn-secondary" @click="closeModal">
                                        Cancel
                                    </button>
                                    <button type="submit" class="btn btn-primary" :disabled="isAssigning">
                                        <span v-if="isAssigning">Assigning...</span>
                                        <span v-else>Assign Role</span>
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

const users = ref([])
const roles = ref([])
const isLoading = ref(false)
const loadingRoles = ref(false)
const isAssigning = ref(false)
const errorMessage = ref('')

const selectedUser = ref(null)
const selectedRole = ref('')
const modalError = ref('')
const modalSuccess = ref('')
let roleModalInstance = null

const loadUsers = async () => {
    isLoading.value = true
    errorMessage.value = ''
    try {
        const response = await api.get('v1/users')
        const data = response.data?.data ?? response.data
        users.value = Array.isArray(data) ? data : []
    } catch (error) {
        console.error('Users loading error:', error)
        users.value = []
        if (error.response?.status === 401) {
            // Redirect handled by interceptor
        } else if (error.response?.data?.message) {
            errorMessage.value = error.response.data.message
        } else {
            errorMessage.value = 'Failed to load users. Please try again.'
        }
    } finally {
        isLoading.value = false
    }
}

const loadRoles = async () => {
    loadingRoles.value = true
    try {
        const response = await api.get('v1/roles')
        const data = response.data?.data ?? response.data
        roles.value = Array.isArray(data) ? data : []
    } catch (error) {
        console.error('Roles loading error:', error)
        roles.value = []
    } finally {
        loadingRoles.value = false
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

const openAssignModal = async (user) => {
    selectedUser.value = user
    selectedRole.value = ''
    modalError.value = ''
    modalSuccess.value = ''

    // Refresh roles list each time modal opens
    await loadRoles()

    const modalElement = document.getElementById('assignRoleModal')
    if (modalElement) {
        roleModalInstance = Modal.getOrCreateInstance(modalElement)
        roleModalInstance.show()
    }
}

const closeModal = () => {
    const modalElement = document.getElementById('assignRoleModal')
    if (modalElement) {
        const modal = Modal.getInstance(modalElement)
        if (modal) {
            modal.hide()
        }
    }
}

const assignRole = async () => {
    if (!selectedUser.value || !selectedRole.value) {
        modalError.value = 'Please select a role.'
        return
    }

    // Check if user already has this role
    const existingRole = selectedUser.value.roles?.find(r => r.name === selectedRole.value)
    if (existingRole) {
        modalError.value = `User already has the "${selectedRole.value}" role.`
        return
    }

    isAssigning.value = true
    modalError.value = ''

    try {
        await api.post(`v1/users/${selectedUser.value.id}/assign-role`, {
            role: selectedRole.value
        })

        modalSuccess.value = 'Role assigned successfully!'

        // Refresh user list after a delay
        setTimeout(async () => {
            closeModal()
            await loadUsers()
        }, 1000)
    } catch (error) {
        if (error.response?.data?.errors?.role) {
            modalError.value = error.response.data.errors.role[0]
        } else {
            modalError.value = error.response?.data?.message || 'Failed to assign role.'
        }
    } finally {
        isAssigning.value = false
    }
}

onMounted(() => {
    loadUsers()
})
</script>
