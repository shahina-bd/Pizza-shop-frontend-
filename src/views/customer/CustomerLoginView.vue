<template>
    <CustomerMaster>
        <div class="container py-5">
            <div class="row justify-content-center">
                <div class="col-md-5">
                    <div class="card shadow-sm">
                        <div class="card-header">
                            <h5 class="mb-0">Customer Login</h5>
                        </div>

                        <div class="card-body">
                            <div v-if="errorMessage" class="alert alert-danger">
                                {{ errorMessage }}
                            </div>

                            <form @submit.prevent="handleLogin">
                                <div class="mb-3">
                                    <label class="form-label">Mobile</label>
                                    <input type="text" class="form-control" v-model="form.mobile">
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Password</label>
                                    <input type="password" class="form-control" v-model="form.password">
                                </div>

                                <button class="btn btn-primary w-100" :disabled="isLoading">
                                    {{ isLoading ? 'Logging in...' : 'Login' }}
                                </button>
                            </form>

                            <p class="mt-3 mb-0 text-center">
                                No account?
                                <router-link :to="{ name: 'customer.register', query: route.query }">
                                    Register
                                </router-link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </CustomerMaster>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CustomerMaster from '@/components/customer/CustomerMaster.vue'
import { useCustomerAuthStore } from '@/stores/customerAuth'

const router = useRouter()
const route = useRoute()
const customerAuthStore = useCustomerAuthStore()

const isLoading = ref(false)
const errorMessage = ref('')

const form = ref({
    mobile: '',
    password: '',
})

const handleLogin = async () => {
    errorMessage.value = ''
    isLoading.value = true

    try {
        await customerAuthStore.login(form.value)

        const redirectTo = route.query.redirect || '/'
        router.push(redirectTo)
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Login failed.'
    } finally {
        isLoading.value = false
    }
}
</script>