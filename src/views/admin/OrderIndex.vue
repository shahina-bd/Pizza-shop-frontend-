<template>
  <AdminMaster>
    <div class="container-fluid">
      <!-- Page Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i class="fas fa-shopping-basket me-2 text-primary"></i>
          Order Management
        </h2>
      </div>

      <!-- Filters & Search -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Search</label>
              <div class="input-group">
                <span class="input-group-text"><i class="fas fa-search"></i></span>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Order ID, customer, phone..."
                  v-model="searchKeyword"
                  @keyup.enter="fetchOrders"
                />
              </div>
            </div>

            <div class="col-md-3">
              <label class="form-label">Order Status</label>
              <select class="form-select" v-model="selectedStatus" @change="fetchOrders">
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div class="col-md-3">
              <label class="form-label">Payment Status</label>
              <select class="form-select" v-model="selectedPaymentStatus" @change="fetchOrders">
                <option value="">All Payments</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div class="col-md-2 d-flex align-items-end">
              <button class="btn btn-outline-primary w-100" @click="fetchOrders">
                Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="card">
        <div class="card-body p-0">
          <div v-if="isLoading" class="text-center p-5">
            <div class="spinner-border text-primary"></div>
            <p class="mt-2 text-muted">Loading orders...</p>
          </div>

          <div v-else class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th style="width: 80px;">Order ID</th>
                  <th>Customer Info</th>
                  <th>Shipping Address</th>
                  <th>Amount</th>
                  <th>Order Status</th>
                  <th>Payment Status</th>
                  <th>Date</th>
                  <th style="width: 180px;" class="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="order in orders" :key="order.id">
                  <td><strong>#{{ order.id }}</strong></td>
                  <td>
                    <div class="fw-bold">{{ order.user?.name ?? 'Guest' }}</div>
                    <small class="text-muted d-block">{{ order.user?.mobile ?? 'N/A' }}</small>
                  </td>
                  <td>
                    <span class="d-inline-block text-truncate" style="max-width: 200px;" :title="order.address">
                      {{ order.address }}
                    </span>
                  </td>
                  <td>৳ {{ Number(order.total).toLocaleString() }}</td>
                  <td>
                    <span :class="getStatusBadgeClass(order.status)">
                      {{ capitalize(order.status) }}
                    </span>
                  </td>
                  <td>
                    <span :class="getPaymentBadgeClass(order.payment_status)">
                      {{ capitalize(order.payment_status) }}
                    </span>
                  </td>
                  <td>{{ formatDate(order.created_at) }}</td>
                  <td class="text-center">
                    <button class="btn btn-sm btn-info me-1" @click="viewOrderDetails(order)" title="View Details">
                      <i class="fas fa-eye me-1"></i> View
                    </button>
                    <button class="btn btn-sm btn-danger" @click="deleteOrder(order.id)" title="Delete Order">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>

                <tr v-if="orders.length === 0">
                  <td colspan="8" class="text-center text-muted py-5">
                    <i class="fas fa-receipt fa-3x mb-3 text-secondary"></i>
                    <p class="mb-0">No orders found.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="pagination.last_page > 1" class="d-flex justify-content-between align-items-center p-3 border-top">
            <span class="text-muted">
              Showing {{ pagination.from }}-{{ pagination.to }} of {{ pagination.total }} orders
            </span>
            <nav>
              <ul class="pagination pagination-sm mb-0">
                <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                  <button class="page-link" @click="changePage(pagination.current_page - 1)">
                    Previous
                  </button>
                </li>
                <li
                  v-for="page in pagination.last_page"
                  :key="page"
                  class="page-item"
                  :class="{ active: pagination.current_page === page }"
                >
                  <button class="page-link" @click="changePage(page)">
                    {{ page }}
                  </button>
                </li>
                <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
                  <button class="page-link" @click="changePage(pagination.current_page + 1)">
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div class="modal fade" id="orderDetailsModal" tabindex="-1" data-bs-backdrop="static">
      <div class="modal-dialog modal-lg">
        <div class="modal-content" v-if="selectedOrder">
          <div class="modal-header bg-light">
            <h5 class="modal-title">
              <i class="fas fa-receipt me-2 text-primary"></i>
              Order Details - #{{ selectedOrder.id }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>

          <div class="modal-body">
            <!-- Order Metadata -->
            <div class="row mb-4">
              <div class="col-md-6">
                <h6>Customer Details</h6>
                <div class="p-2 bg-light rounded">
                  <div><strong>Name:</strong> {{ selectedOrder.user?.name ?? 'Guest' }}</div>
                  <div><strong>Email:</strong> {{ selectedOrder.user?.email ?? 'N/A' }}</div>
                  <div><strong>Phone:</strong> {{ selectedOrder.user?.mobile ?? 'N/A' }}</div>
                  <div><strong>Shipping Address:</strong> {{ selectedOrder.address }}</div>
                </div>
              </div>
              <div class="col-md-6">
                <h6>Order Status Management</h6>
                <div class="p-2 bg-light rounded mb-3">
                  <div class="mb-2">
                    <label class="form-label mb-1"><strong>Order Status:</strong></label>
                    <select class="form-select form-select-sm" v-model="statusForm.status" @change="updateOrderStatus">
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label class="form-label mb-1"><strong>Payment Status:</strong></label>
                    <select class="form-select form-select-sm" v-model="statusForm.payment_status" @change="updatePaymentStatus">
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
                <div><strong>Placed At:</strong> {{ formatDate(selectedOrder.created_at, true) }}</div>
              </div>
            </div>

            <!-- Ordered Items -->
            <h6>Items Ordered</h6>
            <div class="table-responsive">
              <table class="table table-bordered align-middle">
                <thead class="table-light">
                  <tr>
                    <th>Item</th>
                    <th class="text-center" style="width: 100px;">Price</th>
                    <th class="text-center" style="width: 80px;">Qty</th>
                    <th class="text-end" style="width: 120px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in selectedOrder.items" :key="item.id">
                    <td>
                      <div class="d-flex align-items-center">
                        <img
                          :src="getProductImageUrl(item.pizza)"
                          :alt="item.pizza?.name"
                          width="45"
                          height="45"
                          class="rounded me-2 border"
                          style="object-fit: cover;"
                          @error="handleImageError"
                        />
                        <div>
                          <div class="fw-bold">{{ item.pizza?.name ?? 'Deleted Pizza' }}</div>
                          <small class="text-muted">{{ item.pizza?.description ? item.pizza.description.substring(0, 50) + '...' : '' }}</small>
                        </div>
                      </div>
                    </td>
                    <td class="text-center">৳ {{ Number(item.price).toLocaleString() }}</td>
                    <td class="text-center">{{ item.quantity }}</td>
                    <td class="text-end fw-bold">৳ {{ (item.price * item.quantity).toLocaleString() }}</td>
                  </tr>
                  <tr>
                    <td colspan="3" class="text-end fw-bold bg-light">Grand Total</td>
                    <td class="text-end fw-bold text-primary bg-light">৳ {{ Number(selectedOrder.total).toLocaleString() }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
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
import { getProductImageUrl, handleImageError } from '@/utils/imageHelper'

const orders = ref([])
const pagination = ref({
  current_page: 1,
  last_page: 1,
  from: 0,
  to: 0,
  total: 0
})

const isLoading = ref(false)
const searchKeyword = ref('')
const selectedStatus = ref('')
const selectedPaymentStatus = ref('')

const selectedOrder = ref(null)
const statusForm = ref({
  status: '',
  payment_status: ''
})

const capitalize = (val) => {
  if (!val) return ''
  return val.charAt(0).toUpperCase() + val.slice(1)
}

const getStatusBadgeClass = (status) => {
  const map = {
    pending: 'badge bg-warning text-dark',
    processing: 'badge bg-primary',
    shipped: 'badge bg-info text-dark',
    completed: 'badge bg-success',
    cancelled: 'badge bg-danger'
  }
  return map[status] || 'badge bg-secondary'
}

const getPaymentBadgeClass = (status) => {
  const map = {
    pending: 'badge bg-warning text-dark',
    paid: 'badge bg-success',
    failed: 'badge bg-danger'
  }
  return map[status] || 'badge bg-secondary'
}

const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }
  return date.toLocaleDateString('en-US', options)
}

const buildQueryUrl = (page = 1) => {
  const params = new URLSearchParams()
  params.append('page', page)

  if (searchKeyword.value) {
    params.append('search', searchKeyword.value)
  }
  if (selectedStatus.value) {
    params.append('status', selectedStatus.value)
  }
  if (selectedPaymentStatus.value) {
    params.append('payment_status', selectedPaymentStatus.value)
  }

  return `v1/admin/orders?${params.toString()}`
}

const fetchOrders = async (page = 1) => {
  isLoading.value = true
  try {
    const response = await api.get(buildQueryUrl(page))
    if (response.data) {
      orders.value = response.data.data ?? []
      pagination.value = {
        current_page: response.data.current_page ?? 1,
        last_page: response.data.last_page ?? 1,
        from: response.data.from ?? 0,
        to: response.data.to ?? 0,
        total: response.data.total ?? 0
      }
    }
  } catch (error) {
    console.error('Fetch orders error:', error)
    orders.value = []
  } finally {
    isLoading.value = false
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    fetchOrders(page)
  }
}

const viewOrderDetails = (order) => {
  selectedOrder.value = order
  statusForm.value = {
    status: order.status,
    payment_status: order.payment_status
  }
  
  const modalEl = document.getElementById('orderDetailsModal')
  if (modalEl) {
    const modal = Modal.getOrCreateInstance(modalEl)
    modal.show()
  }
}

const closeModal = () => {
  const modalEl = document.getElementById('orderDetailsModal')
  if (modalEl) {
    const modal = Modal.getInstance(modalEl)
    if (modal) modal.hide()
  }
  selectedOrder.value = null
}

const updateOrderStatus = async () => {
  if (!selectedOrder.value) return
  try {
    const response = await api.put(`v1/admin/orders/${selectedOrder.value.id}/status`, {
      status: statusForm.value.status
    })
    if (response.data.success) {
      selectedOrder.value.status = statusForm.value.status
      // Refresh the main table list
      fetchOrders(pagination.value.current_page)
    }
  } catch (error) {
    console.error('Update status error:', error)
    alert(error.response?.data?.message || 'Failed to update order status')
  }
}

const updatePaymentStatus = async () => {
  if (!selectedOrder.value) return
  try {
    const response = await api.put(`v1/admin/orders/${selectedOrder.value.id}/payment-status`, {
      payment_status: statusForm.value.payment_status
    })
    if (response.data.success) {
      selectedOrder.value.payment_status = statusForm.value.payment_status
      // Refresh the main table list
      fetchOrders(pagination.value.current_page)
    }
  } catch (error) {
    console.error('Update payment status error:', error)
    alert(error.response?.data?.message || 'Failed to update payment status')
  }
}

const deleteOrder = async (orderId) => {
  if (!confirm(`Are you sure you want to delete order #${orderId}?`)) return
  try {
    const response = await api.delete(`v1/admin/orders/${orderId}`)
    if (response.data.success) {
      alert('Order deleted successfully')
      fetchOrders(pagination.value.current_page)
    }
  } catch (error) {
    console.error('Delete order error:', error)
    alert(error.response?.data?.message || 'Failed to delete order')
  }
}

onMounted(() => {
  fetchOrders()
})
</script>
