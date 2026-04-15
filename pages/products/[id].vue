<template>
  <div class="pt-20 min-h-screen" v-if="data">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs font-rajdhani text-gray-600 mb-8">
        <NuxtLink to="/" class="hover:text-gray-400 transition-colors">Home</NuxtLink>
        <span>/</span>
        <NuxtLink to="/products" class="hover:text-gray-400 transition-colors">Shop</NuxtLink>
        <span>/</span>
        <span class="text-gray-400">{{ data.product.name }}</span>
      </nav>

      <!-- Product detail -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <!-- Visual panel -->
        <div class="relative">
          <div
            class="relative overflow-hidden flex items-center justify-center"
            style="aspect-ratio: 1; min-height: 400px;"
            :style="`background: linear-gradient(135deg, ${data.product.accentColor}18, ${data.product.accentColor}06, #0f0f1a); border: 1px solid ${data.product.accentColor}30;`"
          >
            <div class="absolute inset-0 circuit-bg opacity-40" />
            <div
              class="absolute inset-0"
              :style="`background: radial-gradient(circle at 50% 50%, ${data.product.accentColor}20, transparent 70%);`"
            />

            <div class="text-9xl animate-float relative z-10">{{ data.product.emoji }}</div>

            <!-- Corner accents -->
            <div class="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2" :style="`border-color: ${data.product.accentColor};`" />
            <div class="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2" :style="`border-color: ${data.product.accentColor};`" />
            <div class="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2" :style="`border-color: ${data.product.accentColor};`" />
            <div class="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2" :style="`border-color: ${data.product.accentColor};`" />
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mt-4">
            <span
              v-if="data.product.bestseller"
              class="badge-neon text-dark-900 text-xs"
              style="background: #ff2d78;"
            >BESTSELLER</span>
            <span
              v-if="data.product.newArrival"
              class="badge-neon text-dark-900 text-xs"
              style="background: #00f5ff;"
            >NEW ARRIVAL</span>
            <span class="badge-neon text-gray-400 text-xs" style="border: 1px solid rgba(255,255,255,0.1);">
              {{ data.product.servings }} Servings
            </span>
            <span class="badge-neon text-gray-400 text-xs" style="border: 1px solid rgba(255,255,255,0.1);">
              In Stock: {{ data.product.stock }}
            </span>
          </div>
        </div>

        <!-- Info panel -->
        <div>
          <!-- Category + Rating -->
          <div class="flex items-center justify-between mb-3">
            <span class="font-orbitron text-xs tracking-widest uppercase" :style="`color: ${data.product.accentColor};`">
              {{ data.product.categoryLabel }}
            </span>
            <div class="flex items-center gap-1.5">
              <div class="flex gap-0.5">
                <span v-for="i in 5" :key="i" class="text-sm" :class="i <= Math.floor(data.product.rating) ? 'text-yellow-400' : 'text-gray-700'">★</span>
              </div>
              <span class="text-sm text-gray-500 font-rajdhani">{{ data.product.rating }} ({{ data.product.reviews.toLocaleString() }})</span>
            </div>
          </div>

          <h1 class="font-orbitron font-black text-3xl sm:text-4xl text-white leading-tight mb-2">
            {{ data.product.name }}
          </h1>
          <p class="text-lg font-rajdhani font-semibold mb-4" :style="`color: ${data.product.accentColor};`">
            {{ data.product.tagline }}
          </p>
          <p class="text-gray-400 font-rajdhani text-base leading-relaxed mb-6">
            {{ data.product.description }}
          </p>

          <!-- Key benefits -->
          <div class="mb-6">
            <h3 class="font-orbitron text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">Key Benefits</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div
                v-for="benefit in data.product.keyBenefits"
                :key="benefit"
                class="flex items-center gap-2 text-sm font-rajdhani text-gray-300"
              >
                <span class="w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs font-bold rounded-full text-dark-900"
                  :style="`background: ${data.product.accentColor};`"
                >✓</span>
                {{ benefit }}
              </div>
            </div>
          </div>

          <!-- Price -->
          <div class="flex items-end gap-3 mb-6 pb-6 border-b border-neon-purple/20">
            <span class="font-orbitron font-black text-4xl text-white">R{{ data.product.price.toFixed(2) }}</span>
            <span v-if="data.product.originalPrice" class="text-xl text-gray-600 line-through font-rajdhani mb-1">
              R{{ data.product.originalPrice.toFixed(2) }}
            </span>
            <span v-if="data.product.originalPrice" class="mb-1 px-2 py-0.5 text-xs font-orbitron font-bold text-dark-900" style="background: #39ff14;">
              SAVE R{{ (data.product.originalPrice - data.product.price).toFixed(2) }}
            </span>
          </div>

          <!-- Flavour selector -->
          <div class="mb-4">
            <label class="font-orbitron text-xs font-bold text-gray-400 tracking-widest uppercase mb-2 block">
              Flavour: <span :style="`color: ${data.product.accentColor};`">{{ selectedFlavour }}</span>
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="f in data.product.flavours"
                :key="f"
                class="text-sm font-rajdhani px-4 py-2 transition-all duration-200"
                :style="selectedFlavour === f
                  ? `background: ${data.product.accentColor}30; border: 1px solid ${data.product.accentColor}; color: white;`
                  : 'background: transparent; border: 1px solid rgba(255,255,255,0.12); color: #9ca3af;'"
                @click="selectedFlavour = f"
              >{{ f }}</button>
            </div>
          </div>

          <!-- Size selector -->
          <div class="mb-6">
            <label class="font-orbitron text-xs font-bold text-gray-400 tracking-widest uppercase mb-2 block">
              Size: <span :style="`color: ${data.product.accentColor};`">{{ selectedSize }}</span>
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="s in data.product.sizes"
                :key="s"
                class="text-sm font-rajdhani px-4 py-2 transition-all duration-200"
                :style="selectedSize === s
                  ? `background: ${data.product.accentColor}30; border: 1px solid ${data.product.accentColor}; color: white;`
                  : 'background: transparent; border: 1px solid rgba(255,255,255,0.12); color: #9ca3af;'"
                @click="selectedSize = s"
              >{{ s }}</button>
            </div>
          </div>

          <!-- Quantity + Add -->
          <div class="flex gap-4 items-center mb-6">
            <div class="flex items-center gap-0" style="border: 1px solid rgba(0,245,255,0.3);">
              <button class="quantity-btn w-10 h-12" @click="qty = Math.max(1, qty - 1)">−</button>
              <span class="w-12 text-center font-orbitron font-bold text-white">{{ qty }}</span>
              <button class="quantity-btn w-10 h-12" @click="qty++">+</button>
            </div>
            <button
              class="btn-neon-primary flex-1 flex items-center justify-center gap-2 text-sm"
              @click="addToCart"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 7H4l1-7z" />
              </svg>
              ADD TO CART
            </button>
          </div>

          <!-- Added confirmation -->
          <Transition name="fade">
            <div
              v-if="addedToCart"
              class="flex items-center gap-2 px-4 py-3 mb-4 text-sm font-rajdhani text-neon-green"
              style="background: rgba(57,255,20,0.08); border: 1px solid rgba(57,255,20,0.3);"
            >
              <span>✓</span>
              <span>Added to cart! <NuxtLink to="/checkout" class="underline hover:text-white">Checkout now →</NuxtLink></span>
            </div>
          </Transition>

          <!-- Trust badges -->
          <div class="flex flex-wrap gap-4 pt-4 border-t border-neon-purple/20">
            <div v-for="trust in trustBadges" :key="trust.label" class="flex items-center gap-2 text-xs text-gray-500 font-rajdhani">
              <span>{{ trust.emoji }}</span>
              {{ trust.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- Ingredients tab -->
      <div class="mb-16">
        <div class="glass-panel p-6 sm:p-8">
          <h3 class="font-orbitron font-bold text-lg text-white mb-4">
            INGREDIENTS & <span class="gradient-text">NUTRITION</span>
          </h3>
          <p class="text-gray-400 font-rajdhani text-sm leading-relaxed">
            {{ data.product.ingredients }}
          </p>
        </div>
      </div>

      <!-- Related products -->
      <div v-if="data.related.length">
        <h2 class="font-orbitron font-bold text-2xl text-white mb-6">
          YOU MAY ALSO <span class="gradient-text">LIKE</span>
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <ProductCard
            v-for="p in data.related"
            :key="p.id"
            :product="p"
            @quick-add="quickAdd"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- 404 -->
  <div v-else class="pt-40 min-h-screen flex flex-col items-center justify-center text-center gap-6 px-4">
    <div class="text-8xl">⚡</div>
    <h1 class="font-orbitron font-black text-4xl gradient-text">PRODUCT NOT FOUND</h1>
    <p class="text-gray-500 font-rajdhani text-lg">This formula doesn't exist in our database.</p>
    <NuxtLink to="/products" class="btn-neon-primary text-sm">BROWSE ALL PRODUCTS</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const cart = useCartStore()

const { data } = await useFetch(`/api/products/${route.params.id}`)

const selectedFlavour = ref((data.value?.product?.flavours[0]) || '')
const selectedSize = ref((data.value?.product?.sizes[0]) || '')
const qty = ref(1)
const addedToCart = ref(false)

const trustBadges = [
  { emoji: '🚚', label: 'Free shipping over R60' },
  { emoji: '🔄', label: '30-day returns' },
  { emoji: '🏅', label: 'Informed Sport tested' },
  { emoji: '🔬', label: 'Lab verified' },
]

function addToCart() {
  if (!data.value?.product) return
  const p = data.value.product
  for (let i = 0; i < qty.value; i++) {
    cart.addItem({
      id: p.id,
      name: p.name,
      price: p.price,
      emoji: p.emoji,
      accentColor: p.accentColor,
      flavour: selectedFlavour.value,
      size: selectedSize.value,
    })
  }
  addedToCart.value = true
  setTimeout(() => { addedToCart.value = false }, 4000)
}

function quickAdd(product: any) {
  cart.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    emoji: product.emoji,
    accentColor: product.accentColor,
    flavour: product.flavours[0] || '',
    size: product.sizes[0] || '',
  })
}

useHead({
  title: data.value?.product ? `${data.value.product.name} — MyEnergy` : 'Product — MyEnergy',
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
