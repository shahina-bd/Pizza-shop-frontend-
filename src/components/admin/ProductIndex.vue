<template>
    <AdminMaster>
        <div>
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>
                    <i class="fas fa-box me-2 text-primary"></i>
                    Product Management
                </h2>

                <button class="btn btn-primary" @click="openModal()">
                    <i class="fas fa-plus me-1"></i>
                    Add New Product
                </button>
            </div>

            <div class="card mb-4">
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <label class="form-label">Search</label>
                            <input type="text" class="form-control" placeholder="Search product..."
                                v-model="searchKeyword" @keyup.enter="searchProducts">
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">Brand</label>
                            <select class="form-select" v-model="selectedBrand">
                                <option value="">All Brands</option>
                                <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                                    {{ brand.name }}
                                </option>
                            </select>
                        </div>

                        <div class="col-md-3">
                            <label class="form-label">Category</label>
                            <select class="form-select" v-model="selectedCategory">
                                <option value="">All Categories</option>
                                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                                    {{ cat.name }}
                                </option>
                            </select>
                        </div>

                        <div class="col-md-2">
                            <label class="form-label">&nbsp;</label>
                            <button class="btn btn-outline-primary w-100" @click="searchProducts">
                                <i class="fas fa-search me-1"></i>
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-body p-0">
                    <div class="text-center p-5" v-if="isLoading">
                        <div class="spinner-border text-primary"></div>
                        <p class="mt-2">Loading...</p>
                    </div>

                    <div class="table-responsive" v-if="!isLoading">
                        <table class="table table-hover mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th style="width: 50px;">ID</th>
                                    <th style="width: 80px;">Image</th>
                                    <th>Product Name</th>
                                    <th>Brand</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    <th style="width: 150px;">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="product in products" :key="product.id">
                                    <td>{{ product.id }}</td>

                                    <td>
                                        <img :src="getProductImage(product)" :alt="product.name" width="50" height="50"
                                            class="rounded border" style="object-fit: cover;" @error="handleImageError">
                                    </td>

                                    <td>{{ product.name }}</td>
                                    <td>{{ product.brand?.name ?? 'N/A' }}</td>
                                    <td>{{ product.category?.name ?? 'N/A' }}</td>
                                    <td>৳ {{ product.price ?? product.selling_price ?? 0 }}</td>

                                    <td>
                                        <span class="badge"
                                            :class="Number(product.stock) > 0 ? 'bg-success' : 'bg-danger'">
                                            {{ product.stock ?? 0 }}
                                        </span>
                                    </td>

                                    <td>
                                        <span class="badge" :class="product.is_active ? 'bg-success' : 'bg-secondary'">
                                            {{ product.status ?? (product.is_active ? 'Active' : 'Inactive') }}
                                        </span>
                                    </td>

                                    <td>
                                        <button class="btn btn-sm btn-info me-1" @click="openModal(product)"
                                            title="Edit">
                                            <i class="fas fa-edit">Edit</i>
                                        </button>

                                        <button class="btn btn-sm btn-danger" @click="deleteProduct(product)"
                                            title="Delete">
                                            <i class="fas fa-trash">Delete</i>
                                        </button>
                                    </td>
                                </tr>

                                <tr v-if="products.length === 0">
                                    <td colspan="9" class="text-center text-muted py-4">
                                        <i class="fas fa-database fa-2x mb-2 d-block"></i>
                                        No products found
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mt-4 px-3 pb-3">
                        <div class="text-muted">
                            Showing {{ products.length }} products
                        </div>
                    </div>

                    <div class="modal fade" id="productModal" tabindex="-1" data-bs-backdrop="static">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title">
                                        <i class="fas fa-plus-circle me-2"></i>
                                        {{ isEditMode ? 'Edit Product' : 'Add New Product' }}
                                    </h5>

                                    <button type="button" class="btn-close" @click="closeModal"></button>
                                </div>

                                <div class="modal-body">
                                    <div v-if="errorMessage" class="alert alert-danger">
                                        {{ errorMessage }}
                                    </div>

                                    <form @submit.prevent="saveProduct">
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">
                                                    Product Name <span class="text-danger">*</span>
                                                </label>
                                                <input type="text" class="form-control"
                                                    placeholder="e.g., iPhone 15 Pro" v-model="form.name">
                                            </div>

                                            <div class="col-md-6 mb-3">
                                                <label class="form-label">Slug</label>
                                                <input type="text" class="form-control"
                                                    placeholder="Auto generated from name" readonly>
                                                <small class="text-muted">Will be auto generated</small>
                                            </div>

                                            <div class="col-md-4 mb-3">
                                                <label class="form-label">Brand</label>
                                                <select class="form-select" v-model="form.brand_id">
                                                    <option value="">Select Brand</option>
                                                    <option v-for="brand in brands" :key="brand.id" :value="brand.id">
                                                        {{ brand.name }}
                                                    </option>
                                                </select>
                                            </div>

                                            <div class="col-md-4 mb-3">
                                                <label class="form-label">
                                                    Category <span class="text-danger">*</span>
                                                </label>
                                                <select class="form-select" v-model="form.category_id">
                                                    <option value="">Select Category</option>
                                                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                                                        {{ cat.name }}
                                                    </option>
                                                </select>
                                            </div>

                                            <div class="col-md-4 mb-3">
                                                <label class="form-label">Stock</label>
                                                <input type="number" class="form-control" min="0" v-model="form.stock">
                                            </div>

                                            <div class="col-md-4 mb-3">
                                                <label class="form-label">
                                                    Price (BDT) <span class="text-danger">*</span>
                                                </label>
                                                <input type="number" class="form-control" placeholder="0.00" min="0"
                                                    step="0.01" v-model="form.selling_price">
                                            </div>

                                            <div class="col-md-4 mb-3">
                                                <label class="form-label">Discount Price (BDT)</label>
                                                <input type="number" class="form-control" placeholder="0.00" min="0"
                                                    step="0.01" v-model="form.discount_price">
                                            </div>

                                            <div class="col-md-4 mb-3">
                                                <label class="form-label">&nbsp;</label>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="is_featured"
                                                        v-model="form.is_featured">
                                                    <label class="form-check-label" for="is_featured">
                                                        Featured Product
                                                    </label>
                                                </div>
                                            </div>

                                            <div class="col-12 mb-3">
                                                <label class="form-label">Description</label>
                                                <textarea class="form-control" rows="3"
                                                    placeholder="Write product details..."
                                                    v-model="form.description"></textarea>
                                            </div>

                                            <div class="col-12 mb-3">
                                                <label class="form-label">Image Path</label>
                                                <input type="text" class="form-control" placeholder="products/image.jpg"
                                                    v-model="form.image">
                                                <small class="text-muted">
                                                    Example: products/image.jpg
                                                </small>
                                            </div>

                                            <div class="col-md-6 mb-3">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="checkbox" id="is_active"
                                                        v-model="form.is_active">
                                                    <label class="form-check-label" for="is_active">
                                                        Active
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="modal-footer px-0 pb-0">
                                            <button type="button" class="btn btn-secondary" @click="closeModal">
                                                Cancel
                                            </button>

                                            <button type="submit" class="btn btn-primary" :disabled="isSaving">
                                                <i class="fas fa-save me-1"></i>

                                                <span v-if="isSaving">Saving...</span>
                                                <span v-else-if="isEditMode">Update Product</span>
                                                <span v-else>Save Product</span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
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

import { getProductImageUrl, handleImageError } from '@/utils/imageHelper'

const products = ref([])
const brands = ref([])
const categories = ref([])

const isLoading = ref(false)
const isSaving = ref(false)

const searchKeyword = ref('')
const selectedBrand = ref('')
const selectedCategory = ref('')

const isEditMode = ref(false)
const selectedProductId = ref(null)
const errorMessage = ref('')

const form = ref({
    name: '',
    brand_id: '',
    category_id: '',
    description: '',
    selling_price: '',
    discount_price: '',
    stock: 0,
    image: '',
    is_active: true,
    is_featured: false,
})

const getProductImage = (product) => {
    return getProductImageUrl(product)
}

const resetForm = () => {
    isEditMode.value = false
    selectedProductId.value = null
    errorMessage.value = ''

    form.value = {
        name: '',
        brand_id: '',
        category_id: '',
        description: '',
        selling_price: '',
        discount_price: '',
        stock: 0,
        image: '',
        is_active: true,
        is_featured: false,
    }
}

const openModal = (product = null) => {
    resetForm()

    if (product) {
        isEditMode.value = true
        selectedProductId.value = product.id

        form.value = {
            name: product.name ?? '',
            brand_id: product.brand_id ?? '',
            category_id: product.category_id ?? '',
            description: product.description ?? '',
            selling_price: product.selling_price ?? product.price ?? '',
            discount_price: product.discount_price ?? '',
            stock: product.stock ?? 0,
            image: product.image ?? '',
            is_active: Boolean(product.is_active),
            is_featured: Boolean(product.is_featured),
        }
    }

    const modalElement = document.getElementById('productModal')

    if (!modalElement) {
        return
    }

    const modal = Modal.getOrCreateInstance(modalElement)
    modal.show()
}

const closeModal = () => {
    const modalElement = document.getElementById('productModal')

    if (!modalElement) {
        return
    }

    const modal = Modal.getInstance(modalElement)

    if (modal) {
        modal.hide()
    }
}

const buildQueryUrl = () => {
    const params = new URLSearchParams()
    params.append('admin', '1')
    params.append('page', '1')

    if (searchKeyword.value) {
        params.append('search', searchKeyword.value)
    }

    if (selectedBrand.value) {
        params.append('brand_id', selectedBrand.value)
    }

    if (selectedCategory.value) {
        params.append('category_id', selectedCategory.value)
    }

    return `v1/admin/pizzas?${params.toString()}`
}

const loadProducts = async () => {
    isLoading.value = true

    try {
        const response = await api.get('v1/admin/pizzas?admin=1')
        products.value = response.data.data ?? response.data
    } catch (error) {
        console.error('Product loading error:', error)
        products.value = []
    } finally {
        isLoading.value = false
    }
}

const searchProducts = async () => {
    isLoading.value = true

    try {
        const response = await api.get(buildQueryUrl())
        products.value = response.data.data ?? response.data
    } catch (error) {
        console.error('Search error:', error)
        products.value = []
    } finally {
        isLoading.value = false
    }
}

const saveProduct = async () => {
    errorMessage.value = ''

    if (!form.value.name) {
        errorMessage.value = 'Product name is required.'
        return
    }

    if (!form.value.category_id) {
        errorMessage.value = 'Category is required.'
        return
    }

    if (!form.value.selling_price) {
        errorMessage.value = 'Price is required.'
        return
    }

    isSaving.value = true

    const payload = {
        name: form.value.name,
        brand_id: form.value.brand_id || null,
        category_id: form.value.category_id,
        description: form.value.description,
        selling_price: form.value.selling_price,
        discount_price: form.value.discount_price || null,
        stock: form.value.stock || 0,
        image: form.value.image || null,
        is_active: form.value.is_active ? 1 : 0,
        is_featured: form.value.is_featured ? 1 : 0,
    }

    try {
        if (isEditMode.value && selectedProductId.value) {
            await api.put(`v1/admin/pizzas/${selectedProductId.value}`, payload)
            alert('Product updated successfully')
        } else {
            await api.post('v1/admin/pizzas', payload)
            alert('Product created successfully')
        }

        closeModal()
        resetForm()
        await loadProducts()
    } catch (error) {
        console.error('Save product error:', error)

        if (error.response?.data?.errors) {
            const firstError = Object.values(error.response.data.errors)[0]
            errorMessage.value = Array.isArray(firstError) ? firstError[0] : firstError
        } else if (error.response?.data?.message) {
            errorMessage.value = error.response.data.message
        } else {
            errorMessage.value = 'Something went wrong.'
        }
    } finally {
        isSaving.value = false
    }
}

const deleteProduct = async (product) => {
    const confirmed = confirm(`Are you sure you want to delete "${product.name}"?`)

    if (!confirmed) {
        return
    }

    try {
        await api.delete(`v1/admin/pizzas/${product.id}`)
        alert('Product deleted successfully')
        await loadProducts()
    } catch (error) {
        console.error('Delete product error:', error)

        if (error.response?.data?.message) {
            alert(error.response.data.message)
        } else {
            alert('Delete failed')
        }
    }
}

const loadBrands = async () => {
    try {
        const response = await api.get('v1/brands')
        brands.value = response.data.data ?? response.data
    } catch (error) {
        console.error('Brands loading error:', error)
        brands.value = []
    }
}

const loadCategories = async () => {
    try {
        const response = await api.get('v1/categories')
        categories.value = response.data.data ?? response.data
    } catch (error) {
        console.error('Categories loading error:', error)
        categories.value = []
    }
}

onMounted(() => {
    loadProducts()
    loadBrands()
    loadCategories()
})
</script>