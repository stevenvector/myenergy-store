<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="scrolled ? 'bg-dark-900/95 backdrop-blur-md border-b border-neon-purple/20' : 'bg-transparent'"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 md:h-20">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="relative">
            <div
              class="w-10 h-10 rounded-none flex items-center justify-center font-orbitron font-black text-lg text-white transition-all duration-300 group-hover:shadow-neon-purple"
              style="background: linear-gradient(135deg, #b026ff, #ff2d78); clip-path: polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%);"
            >
              M
            </div>
            <div class="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-none"
              style="background: linear-gradient(135deg, #b026ff, #ff2d78); filter: blur(8px); z-index: -1;"
            />
          </div>
          <span class="font-orbitron font-black text-xl tracking-widest hidden sm:block">
            <span class="gradient-text">MY</span><span class="text-white">ENERGY</span>
          </span>
        </NuxtLink>

        <!-- Nav links -->
        <nav class="hidden md:flex items-center gap-8">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="font-rajdhani font-semibold text-sm tracking-widest uppercase text-gray-400 hover:text-white transition-colors duration-200 relative group"
          >
            {{ link.label }}
            <span class="absolute -bottom-1 left-0 w-0 h-px group-hover:w-full transition-all duration-300"
              style="background: linear-gradient(90deg, #b026ff, #ff2d78);"
            />
          </NuxtLink>
        </nav>

        <!-- Right actions -->
        <div class="flex items-center gap-3">
          <!-- Search -->
          <NuxtLink
            to="/products"
            class="p-2 text-gray-400 hover:text-neon-cyan transition-colors duration-200 hidden sm:block"
            title="Search products"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </NuxtLink>

          <!-- Cart button -->
          <button
            class="relative flex items-center gap-2 btn-neon-secondary px-4 py-2 text-xs"
            @click="cart.toggleCart()"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 7H4l1-7z" />
            </svg>
            <span class="font-orbitron hidden sm:block">CART</span>
            <span
              v-if="cart.itemCount > 0"
              class="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black text-dark-900 font-orbitron"
              style="background: linear-gradient(135deg, #39ff14, #00f5ff);"
            >
              {{ cart.itemCount > 9 ? '9+' : cart.itemCount }}
            </span>
          </button>

          <!-- Mobile menu -->
          <button
            class="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            @click="mobileOpen = !mobileOpen"
          >
            <svg v-if="!mobileOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <Transition name="slide-down">
        <nav
          v-if="mobileOpen"
          class="md:hidden pb-4 border-t border-neon-purple/20 mt-2 pt-4 flex flex-col gap-3"
        >
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="font-rajdhani font-semibold text-sm tracking-widest uppercase text-gray-300 hover:text-neon-cyan transition-colors px-2 py-1"
            @click="mobileOpen = false"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cart = useCartStore()
const scrolled = ref(false)
const mobileOpen = ref(false)

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Shop' },
  { to: '/products?category=pre-workout', label: 'Pre-Workout' },
  { to: '/products?category=protein', label: 'Protein' },
  { to: '/products?category=energy', label: 'Energy' },
]

onMounted(() => {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 20
  })
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
