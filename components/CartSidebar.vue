<template>
  <!-- Backdrop -->
  <Transition name="fade">
    <div
      v-if="cart.isOpen"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
      @click="cart.closeCart()"
    />
  </Transition>

  <!-- Sidebar -->
  <Transition name="slide-right">
    <div
      v-if="cart.isOpen"
      class="fixed top-0 right-0 bottom-0 w-full max-w-md z-50 flex flex-col"
      style="background: #0a0a10; border-left: 1px solid rgba(176, 38, 255, 0.3); box-shadow: -20px 0 60px rgba(176, 38, 255, 0.15);"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-5 border-b border-neon-purple/20">
        <div>
          <h2 class="font-orbitron font-bold text-lg tracking-widest text-white">YOUR CART</h2>
          <p class="text-xs text-gray-500 font-rajdhani mt-0.5">{{ cart.itemCount }} item{{ cart.itemCount !== 1 ? 's' : '' }}</p>
        </div>
        <button
          class="p-2 text-gray-400 hover:text-white transition-colors"
          @click="cart.closeCart()"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Free shipping bar -->
      <div v-if="cart.subtotal < 60" class="px-6 py-3 bg-dark-700/50 border-b border-neon-purple/10">
        <div class="flex justify-between text-xs font-rajdhani mb-2">
          <span class="text-gray-400">Free shipping at R60</span>
          <span class="text-neon-cyan font-semibold">R{{ (60 - cart.subtotal).toFixed(2) }} away</span>
        </div>
        <div class="h-1.5 bg-dark-600 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            style="background: linear-gradient(90deg, #b026ff, #00f5ff)"
            :style="{ width: `${Math.min((cart.subtotal / 60) * 100, 100)}%` }"
          />
        </div>
      </div>
      <div v-else class="px-6 py-3 bg-neon-green/10 border-b border-neon-green/20">
        <p class="text-xs font-rajdhani text-neon-green font-semibold tracking-wide">
          ✓ FREE SHIPPING UNLOCKED!
        </p>
      </div>

      <!-- Items -->
      <div class="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        <div v-if="cart.items.length === 0" class="flex flex-col items-center justify-center h-full text-center gap-4">
          <div class="text-6xl animate-float">🛒</div>
          <p class="font-orbitron text-gray-500 text-sm tracking-wider">YOUR CART IS EMPTY</p>
          <p class="text-gray-600 text-sm font-rajdhani">Add some supplements and fuel your gains</p>
          <button class="btn-neon-primary text-xs mt-2" @click="cart.closeCart(); navigateTo('/products')">
            SHOP NOW
          </button>
        </div>

        <TransitionGroup name="list">
          <div
            v-for="item in cart.items"
            :key="`${item.id}-${item.flavour}-${item.size}`"
            class="flex gap-4 p-3 rounded-none"
            style="background: rgba(15,15,26,0.8); border: 1px solid rgba(176, 38, 255, 0.15);"
          >
            <!-- Emoji thumb -->
            <div
              class="w-14 h-14 flex items-center justify-center text-2xl flex-shrink-0"
              style="background: rgba(176, 38, 255, 0.1); border: 1px solid rgba(176, 38, 255, 0.2);"
            >
              {{ item.emoji }}
            </div>

            <div class="flex-1 min-w-0">
              <p class="font-orbitron text-xs text-white truncate">{{ item.name }}</p>
              <p class="text-xs text-gray-500 font-rajdhani mt-0.5">{{ item.flavour }} · {{ item.size }}</p>

              <div class="flex items-center justify-between mt-2">
                <!-- Qty controls -->
                <div class="flex items-center gap-1">
                  <button
                    class="quantity-btn"
                    @click="cart.updateQuantity(item.id, item.flavour, item.size, item.quantity - 1)"
                  >
                    −
                  </button>
                  <span class="w-8 text-center text-sm font-orbitron font-bold text-white">{{ item.quantity }}</span>
                  <button
                    class="quantity-btn"
                    @click="cart.updateQuantity(item.id, item.flavour, item.size, item.quantity + 1)"
                  >
                    +
                  </button>
                </div>

                <!-- Price + remove -->
                <div class="flex items-center gap-3">
                  <span class="font-orbitron font-bold text-neon-cyan text-sm">
                    R{{ (item.price * item.quantity).toFixed(2) }}
                  </span>
                  <button
                    class="text-gray-600 hover:text-neon-pink transition-colors"
                    @click="cart.removeItem(item.id, item.flavour, item.size)"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- Footer -->
      <div v-if="cart.items.length > 0" class="px-6 py-5 border-t border-neon-purple/20 space-y-3">
        <div class="space-y-2 text-sm font-rajdhani">
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
          <div class="flex justify-between font-bold text-lg pt-2 border-t border-neon-purple/20">
            <span class="font-orbitron text-white tracking-wider">TOTAL</span>
            <span class="font-orbitron text-neon-cyan">R{{ cart.total.toFixed(2) }}</span>
          </div>
        </div>

        <NuxtLink
          to="/checkout"
          class="btn-neon-primary w-full flex items-center justify-center gap-2 text-xs"
          @click="cart.closeCart()"
        >
          <span>CHECKOUT</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </NuxtLink>

        <button
          class="w-full text-center text-xs text-gray-500 hover:text-gray-300 font-rajdhani transition-colors tracking-wider"
          @click="cart.closeCart()"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cart = useCartStore()
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-right-enter-active, .slide-right-leave-active { transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-right-enter-from, .slide-right-leave-to { transform: translateX(100%); }

.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from { opacity: 0; transform: translateX(20px); }
.list-leave-to { opacity: 0; transform: translateX(-20px); }
</style>
