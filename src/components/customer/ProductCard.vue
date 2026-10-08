<template>
    <div class="pizza-menu-item" :class="{ 'flex-row-reverse': isReversed }">
        <div class="pizza-menu-img">
            <img
                :src="getProductImageUrl(product)"
                :alt="product.name"
                @error="handleImageError"
            />
        </div>

        <div class="pizza-menu-info">
            <h3>{{ product.name }}</h3>

            <p class="pizza-menu-desc">
                {{ product.description || 'Delicious pizza made with fresh ingredients and traditional recipe.' }}
            </p>

            <div class="pizza-menu-meta">
                <span class="pizza-menu-price">৳{{ product.price ?? product.selling_price }}</span>

                <div class="pizza-menu-actions">
                    <button class="pizza-menu-order-btn" @click="orderNow">
                        Order
                    </button>
                    <button 
                        class="pizza-menu-cart-btn" 
                        :class="{ 'added': isAdded }"
                        @click="addToCart" 
                        :disabled="isAdded"
                        title="Add to Cart"
                    >
                        <i :class="isAdded ? 'fas fa-check' : 'fas fa-cart-plus'"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { getProductImageUrl, handleImageError } from '@/utils/imageHelper'

const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
    isReversed: {
        type: Boolean,
        default: false,
    },
})

const router = useRouter()
const cartStore = useCartStore()
const isAdded = ref(false)

const addToCart = () => {
    cartStore.addToCart(props.product)
    isAdded.value = true
    setTimeout(() => {
        isAdded.value = false
    }, 1500)
}

const orderNow = () => {
    cartStore.addToCart(props.product)
    router.push({ name: 'cart' })
}
</script>

<style scoped>
.pizza-menu-meta {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    margin-top: auto;
    width: 100%;
}

.pizza-menu-price {
    color: var(--pizza-gold);
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    line-height: 1.2;
}

.pizza-menu-actions {
    display: flex;
    gap: 8px;
    align-items: center;
    width: 100%;
}

.pizza-menu-order-btn {
    flex: 1;
    background: var(--pizza-gold);
    color: var(--pizza-black) !important;
    border: 1px solid var(--pizza-gold);
    font-weight: 700;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.pizza-menu-order-btn:hover {
    background: var(--pizza-gold-hover);
    border-color: var(--pizza-gold-hover);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(250, 197, 100, 0.35);
}

.pizza-menu-cart-btn {
    flex: 0 0 38px;
    background: transparent;
    color: var(--pizza-gold);
    border: 1px solid rgba(250, 197, 100, 0.5);
    font-size: 0.95rem;
    width: 38px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.pizza-menu-cart-btn i {
    transition: transform 0.2s ease;
}

.pizza-menu-cart-btn:hover {
    background: rgba(250, 197, 100, 0.1);
    border-color: var(--pizza-gold);
    color: var(--pizza-gold);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(250, 197, 100, 0.2);
}

.pizza-menu-cart-btn:hover i {
    transform: scale(1.15);
}

.pizza-menu-cart-btn.added {
    background: #28a745 !important;
    border-color: #28a745 !important;
    color: var(--pizza-white) !important;
}

.pizza-menu-cart-btn.added i {
    transform: scale(1.1);
    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes popIn {
    0% {
        transform: scale(0.3);
        opacity: 0;
    }
    100% {
        transform: scale(1.1);
        opacity: 1;
    }
}
</style>
