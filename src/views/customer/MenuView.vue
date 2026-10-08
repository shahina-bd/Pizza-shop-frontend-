<template>
    <CustomerMaster>
        <!-- Hero Section -->
        <section class="menu-hero-section">
            <div class="container text-center">
                <span class="menu-accent">Authentic Taste</span>
                <h1 class="menu-title">Our Menu</h1>
                <div class="menu-separator"></div>
            </div>
        </section>

        <!-- Search & Filter Controls Section -->
        <section class="pizza-section py-4 bg-dark-controls">
            <div class="container">
                <div class="row align-items-center g-3">
                    <!-- Category Filters -->
                    <div class="col-lg-8 order-2 order-lg-1">
                        <div class="menu-categories">
                            <button
                                class="category-btn"
                                :class="{ active: selectedCategoryId === null }"
                                @click="filterCategory(null)"
                            >
                                All Pizzas
                            </button>
                            <button
                                v-for="cat in categories"
                                :key="cat.id"
                                class="category-btn"
                                :class="{ active: selectedCategoryId === cat.id }"
                                @click="filterCategory(cat.id)"
                            >
                                {{ cat.name }}
                            </button>
                        </div>
                    </div>

                    <!-- Search Input -->
                    <div class="col-lg-4 order-1 order-lg-2">
                        <div class="search-box-wrap">
                            <input
                                type="text"
                                class="search-control"
                                placeholder="Search for your favorite pizza..."
                                v-model="searchQuery"
                                @input="debouncedSearch"
                            />
                            <i class="fas fa-search search-icon"></i>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Menu Grid Section -->
        <section class="pizza-section menu-grid-section">
            <div class="container">
                <!-- Loading State -->
                <div class="text-center py-5" v-if="isLoading">
                    <div class="spinner-border pizza-loading"></div>
                    <p class="mt-2 pizza-about-text">Loading pizzas...</p>
                </div>

                <!-- Products Grid -->
                <div class="row g-4" v-else>
                    <div
                        class="col-md-6 col-lg-4"
                        v-for="(product, index) in products"
                        :key="product.id"
                    >
                        <ProductCard :product="product" :is-reversed="Math.floor(index / 3) % 2 === 1" />
                    </div>

                    <!-- Pagination Control -->
                    <div class="col-12 mt-5 d-flex justify-content-center" v-if="lastPage > 1">
                        <nav aria-label="Pizza Menu Pagination">
                            <ul class="pizza-pagination">
                                <li :class="{ disabled: currentPage === 1 }">
                                    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" aria-label="Previous Page">
                                        <i class="fas fa-chevron-left"></i>
                                    </button>
                                </li>
                                <li v-for="page in lastPage" :key="page" :class="{ active: page === currentPage }">
                                    <button @click="changePage(page)">
                                        {{ page }}
                                    </button>
                                </li>
                                <li :class="{ disabled: currentPage === lastPage }">
                                    <button @click="changePage(currentPage + 1)" :disabled="currentPage === lastPage" aria-label="Next Page">
                                        <i class="fas fa-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <!-- Empty State -->
                    <div class="col-12" v-if="products.length === 0">
                        <div class="alert pizza-empty text-center py-5">
                            <i class="fas fa-pizza-slice mb-3" style="font-size: 2.5rem; color: var(--pizza-gold); opacity: 0.7;"></i>
                            <h4 class="text-white mb-2">No Pizzas Found</h4>
                            <p class="mb-0 text-muted">We couldn't find any pizzas matching your criteria. Try adjusting your search or filters.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </CustomerMaster>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/utils/axios'
import CustomerMaster from '@/components/customer/CustomerMaster.vue'
import ProductCard from '@/components/customer/ProductCard.vue'

const products = ref([])
const categories = ref([])
const isLoading = ref(false)
const currentPage = ref(1)
const lastPage = ref(1)
const selectedCategoryId = ref(null)
const searchQuery = ref('')
let searchTimeout = null

const loadCategories = async () => {
    try {
        const response = await api.get('categories')
        const allCategories = response.data.data ?? response.data
        // Only include standard pizza categories
        categories.value = allCategories.filter(cat =>
            ['Vegetarian', 'Meat Lovers', 'Cheese'].includes(cat.name)
        )
    } catch (error) {
        console.error('Category loading error:', error)
        categories.value = []
    }
}

const loadProducts = async (page = 1) => {
    isLoading.value = true

    try {
        const params = {
            page,
            per_page: 6
        }

        if (selectedCategoryId.value !== null) {
            params.category_id = selectedCategoryId.value
        }

        if (searchQuery.value.trim() !== '') {
            params.search = searchQuery.value
        }

        const response = await api.get('pizzas', { params })
        products.value = response.data.data ?? []
        currentPage.value = response.data.meta?.current_page ?? 1
        lastPage.value = response.data.meta?.last_page ?? 1
    } catch (error) {
        console.error('Product loading error:', error)
        products.value = []
    } finally {
        isLoading.value = false
    }
}

const filterCategory = (categoryId) => {
    selectedCategoryId.value = categoryId
    loadProducts(1)
}

const debouncedSearch = () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        loadProducts(1)
    }, 450)
}

const changePage = (page) => {
    if (page < 1 || page > lastPage.value) return
    loadProducts(page)
    const el = document.querySelector('.menu-grid-section')
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
    }
}

onMounted(() => {
    loadCategories()
    loadProducts()
})
</script>

<style scoped>
.menu-hero-section {
    background: linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)),
                url('https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600&auto=format&fit=crop') center/cover no-repeat;
    padding: 6.5rem 0;
    border-bottom: 1px solid rgba(250, 197, 100, 0.15);
}

.menu-accent {
    font-family: var(--pizza-script);
    color: var(--pizza-gold);
    font-size: 2.2rem;
    display: block;
    margin-bottom: 0.5rem;
}

.menu-title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    color: var(--pizza-white);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0;
}

.menu-separator {
    width: 60px;
    height: 3px;
    background: var(--pizza-gold);
    margin: 1.5rem auto 0;
}

.bg-dark-controls {
    background: #0d0d0d;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.menu-categories {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.category-btn {
    background: transparent;
    color: var(--pizza-white);
    border: 1px solid rgba(255, 255, 255, 0.15);
    padding: 0.5rem 1.25rem;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    border-radius: 0;
    transition: all 0.3s ease;
}

.category-btn:hover {
    border-color: var(--pizza-gold);
    color: var(--pizza-gold);
}

.category-btn.active {
    background: var(--pizza-gold);
    border-color: var(--pizza-gold);
    color: var(--pizza-black);
    font-weight: 600;
}

.search-box-wrap {
    position: relative;
    width: 100%;
}

.search-control {
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--pizza-white);
    padding: 0.6rem 2.5rem 0.6rem 1rem;
    font-size: 0.88rem;
    border-radius: 0;
    transition: all 0.3s ease;
}

.search-control:focus {
    outline: none;
    border-color: var(--pizza-gold);
    background: rgba(250, 197, 100, 0.02);
    box-shadow: 0 0 8px rgba(250, 197, 100, 0.15);
}

.search-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.4);
    pointer-events: none;
    font-size: 0.95rem;
}

.menu-grid-section {
    background: var(--pizza-dark);
}

.pizza-pagination {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    gap: 8px;
    align-items: center;
}

.pizza-pagination li button {
    background: transparent;
    border: 1px solid rgba(250, 197, 100, 0.3);
    color: var(--pizza-gold);
    width: 38px;
    height: 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.pizza-pagination li button:hover:not(:disabled) {
    background: rgba(250, 197, 100, 0.1);
    border-color: var(--pizza-gold);
    color: var(--pizza-gold);
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(250, 197, 100, 0.15);
}

.pizza-pagination li.active button {
    background: var(--pizza-gold);
    border-color: var(--pizza-gold);
    color: var(--pizza-black);
}

.pizza-pagination li.disabled button {
    opacity: 0.35;
    cursor: not-allowed;
    border-color: rgba(255, 255, 255, 0.1);
    color: var(--pizza-white);
}
</style>
