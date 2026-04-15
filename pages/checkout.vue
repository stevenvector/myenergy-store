<template>
  <div class="pt-20 min-h-screen">
    <div class="relative py-12 overflow-hidden">
      <div class="absolute inset-0 circuit-bg opacity-20" />
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="font-orbitron font-black text-4xl text-white">
          CHECK<span class="gradient-text">OUT</span>
        </h1>
        <p class="text-gray-500 font-rajdhani mt-2">Secure checkout — all data is encrypted</p>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Success state -->
      <div
        v-if="orderSuccess"
        class="text-center py-20 max-w-lg mx-auto"
      >
        <div class="text-7xl mb-6 animate-float">🎉</div>
        <h2 class="font-orbitron font-black text-3xl gradient-text mb-4">ORDER CONFIRMED!</h2>
        <p class="text-gray-400 font-rajdhani text-lg mb-2">
          Order ID: <span class="text-neon-cyan font-bold font-orbitron text-sm">{{ orderId }}</span>
        </p>
        <p class="text-gray-500 font-rajdhani mb-8">
          Thank you for your order! A confirmation email will be sent shortly. Get ready to go beyond the pixels.
        </p>
        <NuxtLink to="/products" class="btn-neon-primary text-sm">KEEP SHOPPING</NuxtLink>
      </div>

      <!-- Empty cart -->
      <div v-else-if="cart.items.length === 0" class="text-center py-20">
        <div class="text-7xl mb-6">🛒</div>
        <h2 class="font-orbitron font-black text-2xl text-gray-500 mb-4">YOUR CART IS EMPTY</h2>
        <NuxtLink to="/products" class="btn-neon-primary text-sm">SHOP NOW</NuxtLink>
      </div>

      <!-- Checkout form -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <!-- Form -->
        <div class="lg:col-span-3 space-y-6">
          <!-- Contact info -->
          <div class="glass-panel p-6">
            <h3 class="font-orbitron font-bold text-sm text-neon-purple tracking-widest uppercase mb-5">
              01 — CONTACT
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-orbitron text-gray-500 tracking-wider mb-1.5">First Name</label>
                <input v-model="form.firstName" type="text" class="checkout-input" :class="{ 'border-neon-pink': errors.firstName }" />
                <p v-if="errors.firstName" class="text-neon-pink text-xs mt-1 font-rajdhani">Required</p>
              </div>
              <div>
                <label class="block text-xs font-orbitron text-gray-500 tracking-wider mb-1.5">Last Name</label>
                <input v-model="form.lastName" type="text" class="checkout-input" :class="{ 'border-neon-pink': errors.lastName }" />
                <p v-if="errors.lastName" class="text-neon-pink text-xs mt-1 font-rajdhani">Required</p>
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-orbitron text-gray-500 tracking-wider mb-1.5">Email</label>
                <input v-model="form.email" type="email" class="checkout-input" :class="{ 'border-neon-pink': errors.email }" />
                <p v-if="errors.email" class="text-neon-pink text-xs mt-1 font-rajdhani">Valid email required</p>
              </div>
              <div class="col-span-2">
                <label class="block text-xs font-orbitron text-gray-500 tracking-wider mb-1.5">Phone (optional)</label>
                <input v-model="form.phone" type="tel" class="checkout-input" />
              </div>
            </div>
          </div>

          <!-- Shipping address -->
          <div class="glass-panel p-6">
            <h3 class="font-orbitron font-bold text-sm text-neon-cyan tracking-widest uppercase mb-5">
              02 — SHIPPING ADDRESS
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-orbitron text-gray-500 tracking-wider mb-1.5">Address Line 1</label>
                <input v-model="form.address" type="text" class="checkout-input" :class="{ 'border-neon-pink': errors.address }" />
                <p v-if="errors.address" class="text-neon-pink text-xs mt-1 font-rajdhani">Required</p>
              </div>
              <div>
                <label class="block text-xs font-orbitron text-gray-500 tracking-wider mb-1.5">Address Line 2 (optional)</label>
                <input v-model="form.address2" type="text" class="checkout-input" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-orbitron text-gray-500 tracking-wider mb-1.5">City</label>
                  <input v-model="form.city" type="text" class="checkout-input" :class="{ 'border-neon-pink': errors.city }" />
                  <p v-if="errors.city" class="text-neon-pink text-xs mt-1 font-rajdhani">Required</p>
                </div>
                <div>
                  <label class="block text-xs font-orbitron text-gray-500 tracking-wider mb-1.5">Postcode</label>
                  <input v-model="form.postcode" type="text" class="checkout-input" :class="{ 'border-neon-pink': errors.postcode }" />
                  <p v-if="errors.postcode" class="text-neon-pink text-xs mt-1 font-rajdhani">Required</p>
                </div>
              </div>
              <div>
                <label class="block text-xs font-orbitron text-gray-500 tracking-wider mb-1.5">Country</label>
                <select v-model="form.country" class="checkout-input">
                  <option value="GB">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="IE">Ireland</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Payment (demo) -->
          <div class="glass-panel p-6">
            <h3 class="font-orbitron font-bold text-sm text-neon-pink tracking-widest uppercase mb-5">
              03 — PAYMENT
            </h3>
            <div
              class="p-4 text-center font-rajdhani text-gray-500 text-sm"
              style="border: 1px dashed rgba(176,38,255,0.3); background: rgba(176,38,255,0.04);"
            >
              <p class="text-neon-purple font-semibold mb-1">🔒 PayFast — Secure Payment</p>
              <p>Powered by PayFast — South Africa's leading payment gateway.<br />Accepts Visa, Mastercard, Instant EFT, SnapScan, Zapper & more.<br /><span class="text-gray-600 text-xs">Click "Place Order" to simulate a successful order.</span></p>
            </div>
          </div>
        </div>

        <!-- Order summary -->
        <div class="lg:col-span-2">
          <div class="glass-panel p-6 sticky top-24">
            <h3 class="font-orbitron font-bold text-sm text-white tracking-widest uppercase mb-5">ORDER SUMMARY</h3>

            <div class="space-y-3 mb-6">
              <div
                v-for="item in cart.items"
                :key="`${item.id}-${item.flavour}`"
                class="flex gap-3 items-center"
              >
                <div
                  class="w-10 h-10 flex items-center justify-center text-lg flex-shrink-0"
                  style="background: rgba(176,38,255,0.1); border: 1px solid rgba(176,38,255,0.2);"
                >
                  {{ item.emoji }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-orbitron text-xs text-white truncate">{{ item.name }}</p>
                  <p class="text-xs text-gray-600 font-rajdhani">{{ item.flavour }} · {{ item.size }} × {{ item.quantity }}</p>
                </div>
                <span class="font-orbitron text-sm text-white whitespace-nowrap">
                  R{{ (item.price * item.quantity).toFixed(2) }}
                </span>
              </div>
            </div>

            <!-- Totals -->
            <div class="space-y-2 text-sm font-rajdhani border-t border-neon-purple/20 pt-4">
              <div class="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span class="text-white">R{{ cart.subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span :class="cart.shippingCost === 0 ? 'text-neon-green' : 'text-white'">
                  {{ cart.shippingCost === 0 ? 'FREE' : `R${cart.shippingCost.toFixed(2)}` }}
                </span>
              </div>
              <div class="flex justify-between font-bold text-base pt-2 border-t border-neon-purple/20">
                <span class="font-orbitron text-white tracking-wider">TOTAL</span>
                <span class="font-orbitron text-neon-cyan">R{{ cart.total.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Place order -->
            <button
              class="btn-neon-primary w-full mt-6 flex items-center justify-center gap-2 text-xs"
              :disabled="loading"
              @click="placeOrder"
            >
              <span v-if="loading" class="animate-pulse">PROCESSING...</span>
              <span v-else>PLACE ORDER</span>
              <svg v-if="!loading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            <p v-if="submitError" class="text-neon-pink text-xs mt-3 font-rajdhani text-center">{{ submitError }}</p>

            <p class="text-xs text-gray-600 font-rajdhani text-center mt-4">
              🔒 Your data is encrypted and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cart = useCartStore()
const loading = ref(false)
const orderSuccess = ref(false)
const orderId = ref('')
const submitError = ref('')

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  address2: '',
  city: '',
  postcode: '',
  country: 'GB',
})

const errors = reactive<Record<string, boolean>>({
  firstName: false,
  lastName: false,
  email: false,
  address: false,
  city: false,
  postcode: false,
})

function validate() {
  let valid = true
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  errors.firstName = !form.firstName.trim()
  errors.lastName = !form.lastName.trim()
  errors.email = !emailRe.test(form.email)
  errors.address = !form.address.trim()
  errors.city = !form.city.trim()
  errors.postcode = !form.postcode.trim()

  valid = !Object.values(errors).some(Boolean)
  return valid
}

async function placeOrder() {
  if (!validate()) return
  loading.value = true
  submitError.value = ''

  try {
    const result = await $fetch('/api/orders', {
      method: 'POST',
      body: {
        ...form,
        items: cart.items,
        subtotal: cart.subtotal,
        shippingCost: cart.shippingCost,
        total: cart.total,
      },
    })

    orderId.value = (result as any).order.id
    cart.clearCart()
    orderSuccess.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  catch (e: any) {
    submitError.value = e?.data?.message || 'Something went wrong. Please try again.'
  }
  finally {
    loading.value = false
  }
}

useHead({ title: 'Checkout — MyEnergy' })
</script>

<style>
.checkout-input {
  @apply w-full bg-dark-800 text-white text-sm font-rajdhani px-4 py-3 outline-none transition-all;
  border: 1px solid rgba(176, 38, 255, 0.25);
}
.checkout-input:focus {
  border-color: rgba(176, 38, 255, 0.7);
  box-shadow: 0 0 10px rgba(176, 38, 255, 0.15);
}
.checkout-input.border-neon-pink {
  border-color: rgba(255, 45, 120, 0.6) !important;
}
.checkout-input option {
  background: #0f0f1a;
}
</style>
