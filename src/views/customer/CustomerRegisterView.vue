<template>
    <CustomerMaster>
        <div class="container py-5">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card shadow-sm">
                        <div class="card-header">
                            <h5 class="mb-0">Customer Registration</h5>
                        </div>

                        <div class="card-body">
                            <div v-if="errorMessage" class="alert alert-danger">
                                {{ errorMessage }}
                            </div>

                            <form @submit.prevent="handleRegister">
                                <div class="mb-3">
                                    <label class="form-label">Name</label>
                                    <input type="text" class="form-control" v-model="form.name">
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Mobile</label>
                                    <input type="text" class="form-control" v-model="form.mobile">
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-control" v-model="form.email">
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Address</label>
                                    <textarea class="form-control" rows="2" v-model="form.address"></textarea>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Password</label>
                                    <input type="password" class="form-control" v-model="form.password">
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Confirm Password</label>
                                    <input type="password" class="form-control" v-model="form.password_confirmation">
                                </div>

                                <button class="btn btn-primary w-100" :disabled="isLoading">
                                    {{ isLoading ? 'Creating account...' : 'Register' }}
                                </button>
                            </form>

                            <p class="mt-3 mb-0 text-center">
                                Already have account?
                                <router-link :to="{ name: 'customer.login', query: route.query }">
                                    Login
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
    name: '',
    mobile: '',
    email: '',
    address: '',
    password: '',
    password_confirmation: '',
})

const handleRegister = async () => {
    errorMessage.value = ''
    isLoading.value = true

    try {
        await customerAuthStore.register(form.value)

        const redirectTo = route.query.redirect || '/'
        router.push(redirectTo)
    } catch (error) {
        if (error.response?.data?.errors) {
            const firstError = Object.values(error.response.data.errors)[0]
            errorMessage.value = Array.isArray(firstError) ? firstError[0] : firstError
        } else {
            errorMessage.value = error.response?.data?.message || 'Registration failed.'
        }
    } finally {
        isLoading.value = false
    }
}
</script>