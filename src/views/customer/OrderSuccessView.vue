<template>
    <CustomerMaster>
        <section class="py-5 pizza-section d-flex align-items-center" style="min-height: 70vh;">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-7 text-center">
                        <div class="card border-0 shadow-lg p-5 rounded-4 bg-dark text-white text-center">
                            <!-- Success Checkmark Animation -->
                            <div class="success-checkmark mb-4">
                                <div class="check-icon">
                                    <span class="icon-line line-tip"></span>
                                    <span class="icon-line line-long"></span>
                                    <div class="icon-circle"></div>
                                    <div class="icon-fix"></div>
                                </div>
                            </div>

                            <h2 class="mb-3 fw-bold text-accent">Order Placed Successfully!</h2>
                            <p class="text-light mb-4 opacity-75">
                                Thank you for your order. We are preparing your delicious pizza right now!
                            </p>

                            <div v-if="isLoading" class="py-3">
                                <div class="spinner-border text-warning" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>

                            <div v-else-if="order" class="order-details-card bg-black bg-opacity-50 p-4 rounded-3 text-start mb-4 border border-secondary border-opacity-25">
                                <div class="row mb-2 border-bottom border-secondary border-opacity-25 pb-2">
                                    <div class="col-6 text-muted">Order ID:</div>
                                    <div class="col-6 text-end fw-bold text-warning">#{{ order.id }}</div>
                                </div>

                                <div class="row mb-2 border-bottom border-secondary border-opacity-25 pb-2">
                                    <div class="col-6 text-muted">Customer Name:</div>
                                    <div class="col-6 text-end fw-bold">{{ order.customer_name || order.user?.name }}</div>
                                </div>

                                <div class="row mb-2 border-bottom border-secondary border-opacity-25 pb-2">
                                    <div class="col-6 text-muted">Payment Status:</div>
                                    <div class="col-6 text-end">
                                        <span :class="order.payment_status === 'paid' ? 'badge bg-success' : 'badge bg-warning text-dark'">
                                            {{ order.payment_status === 'paid' ? 'Paid' : 'Pending (COD)' }}
                                        </span>
                                    </div>
                                </div>

                                <div class="row mb-2 border-bottom border-secondary border-opacity-25 pb-2">
                                    <div class="col-6 text-muted">Delivery Address:</div>
                                    <div class="col-6 text-end text-truncate-custom" :title="order.address">{{ order.address }}</div>
                                </div>

                                <div class="row pt-2">
                                    <div class="col-6 text-muted fw-bold">Total Amount:</div>
                                    <div class="col-6 text-end fw-bold text-accent fs-5">৳ {{ order.total }}</div>
                                </div>
                            </div>

                            <div class="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-2">
                                <router-link to="/customer/orders" class="btn btn-warning px-4 py-2.5 fw-bold text-dark rounded-pill">
                                    View Orders History
                                </router-link>
                                <router-link to="/" class="btn btn-outline-light px-4 py-2.5 fw-bold rounded-pill">
                                    Back to Home
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </CustomerMaster>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/utils/axios'
import CustomerMaster from '@/components/customer/CustomerMaster.vue'

const route = useRoute()
const order = ref(null)
const isLoading = ref(false)

const fetchOrderDetails = async () => {
    const orderId = route.query.order
    if (!orderId) return

    isLoading.value = true
    try {
        const response = await api.get(`v1/customer/orders/${orderId}`)
        order.value = response.data.order
    } catch (error) {
        console.error('Error fetching order details:', error)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchOrderDetails()
})
</script>

<style scoped>
.text-accent {
    color: #ffc107;
}

.text-truncate-custom {
    max-height: 48px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

/* Success Checkmark Animation Styles */
.success-checkmark {
    width: 80px;
    height: 80px;
    margin: 0 auto;
}

.success-checkmark .check-icon {
    width: 80px;
    height: 80px;
    position: relative;
    border-radius: 50%;
    box-sizing: content-box;
    border: 4px solid #ffc107;
}

.success-checkmark .check-icon::before,
.success-checkmark .check-icon::after {
    content: '';
    height: 100px;
    position: absolute;
    background: transparent;
    transform: rotate(-45deg);
}

.success-checkmark .check-icon .icon-line {
    height: 5px;
    background-color: #ffc107;
    display: block;
    border-radius: 2px;
    position: absolute;
    z-index: 10;
}

.success-checkmark .check-icon .icon-line.line-tip {
    top: 43px;
    left: 14px;
    width: 25px;
    transform: rotate(45deg);
    animation: icon-line-tip 0.75s;
}

.success-checkmark .check-icon .icon-line.line-long {
    top: 38px;
    right: 8px;
    width: 47px;
    transform: rotate(-45deg);
    animation: icon-line-long 0.75s;
}

.success-checkmark .check-icon .icon-circle {
    top: -4px;
    left: -4px;
    z-index: 10;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    position: absolute;
    box-sizing: content-box;
    border: 4px solid rgba(255, 193, 7, 0.2);
}

.success-checkmark .check-icon .icon-fix {
    top: 8px;
    width: 5px;
    left: 26px;
    z-index: 1;
    height: 85px;
    position: absolute;
    transform: rotate(-45deg);
    background: transparent;
}

@keyframes icon-line-tip {
    0% {
        width: 0;
        left: 1px;
        top: 19px;
    }
    54% {
        width: 0;
        left: 1px;
        top: 19px;
    }
    70% {
        width: 50px;
        left: -8px;
        top: 37px;
    }
    84% {
        width: 17px;
        left: 21px;
        top: 48px;
    }
    100% {
        width: 25px;
        left: 14px;
        top: 43px;
    }
}

@keyframes icon-line-long {
    0% {
        width: 0;
        right: 46px;
        top: 54px;
    }
    65% {
        width: 0;
        right: 46px;
        top: 54px;
    }
    84% {
        width: 55px;
        right: 0px;
        top: 35px;
    }
    100% {
        width: 47px;
        right: 8px;
        top: 38px;
    }
}
</style>
