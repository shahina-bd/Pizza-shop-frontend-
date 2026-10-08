import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getProductImageUrl } from '@/utils/imageHelper'

export const useCartStore = defineStore('cart', () => {
  const items = ref(JSON.parse(localStorage.getItem('cart_items')) || [])

  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalAmount = computed(() => {
    return items.value.reduce((total, item) => {
      return total + Number(item.price) * item.quantity
    }, 0)
  })

  const saveCart = () => {
    localStorage.setItem('cart_items', JSON.stringify(items.value))
  }

  const addToCart = (product) => {
    const existingItem = items.value.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: Number(product.price ?? product.selling_price ?? 0),
        image: getProductImageUrl(product),
        quantity: 1,
      })
    }

    saveCart()
  }

  const increaseQuantity = (id) => {
    const item = items.value.find((item) => item.id === id)

    if (item) {
      item.quantity += 1
      saveCart()
    }
  }

  const decreaseQuantity = (id) => {
    const item = items.value.find((item) => item.id === id)

    if (!item) return

    if (item.quantity > 1) {
      item.quantity -= 1
    } else {
      removeItem(id)
      return
    }

    saveCart()
  }

  const removeItem = (id) => {
    items.value = items.value.filter((item) => item.id !== id)
    saveCart()
  }

  const clearCart = () => {
    items.value = []
    saveCart()
  }

  return {
    items,
    totalItems,
    totalAmount,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
  }
})
