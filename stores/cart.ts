import { defineStore } from 'pinia'

export interface CartItem {
  id: string
  name: string
  price: number
  emoji: string
  accentColor: string
  flavour: string
  size: string
  quantity: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    isOpen: false,
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    shippingCost: (state) => {
      const sub = state.items.reduce((s, i) => s + i.price * i.quantity, 0)
      return sub >= 60 ? 0 : 4.99
    },
    total(): number {
      return (this.subtotal as number) + (this.shippingCost as number)
    },
  },

  actions: {
    addItem(item: Omit<CartItem, 'quantity'>) {
      const existing = this.items.find(
        i => i.id === item.id && i.flavour === item.flavour && i.size === item.size,
      )
      if (existing) {
        existing.quantity++
      }
      else {
        this.items.push({ ...item, quantity: 1 })
      }
      this.isOpen = true
    },

    removeItem(id: string, flavour: string, size: string) {
      const idx = this.items.findIndex(i => i.id === id && i.flavour === flavour && i.size === size)
      if (idx > -1) this.items.splice(idx, 1)
    },

    updateQuantity(id: string, flavour: string, size: string, qty: number) {
      const item = this.items.find(i => i.id === id && i.flavour === flavour && i.size === size)
      if (item) {
        if (qty <= 0) this.removeItem(id, flavour, size)
        else item.quantity = qty
      }
    },

    clearCart() {
      this.items = []
    },

    openCart() { this.isOpen = true },
    closeCart() { this.isOpen = false },
    toggleCart() { this.isOpen = !this.isOpen },
  },
})
