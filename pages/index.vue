<template>
  <div>
    <!-- ─── Hero ───────────────────────────────────────────────── -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <!-- Background layers -->
      <div class="absolute inset-0 circuit-bg" />
      <div class="absolute inset-0"
        style="background: radial-gradient(ellipse at 30% 50%, rgba(176, 38, 255, 0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(0, 245, 255, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(255, 45, 120, 0.06) 0%, transparent 50%);"
      />

      <!-- Scan line -->
      <div class="scan-overlay" />

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <!-- Pre-title -->
        <div class="inline-flex items-center gap-3 mb-6 px-4 py-2"
          style="border: 1px solid rgba(176, 38, 255, 0.4); background: rgba(176, 38, 255, 0.08);"
        >
          <span class="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span class="font-orbitron text-xs tracking-widest text-neon-purple uppercase">New Drop Available</span>
        </div>

        <!-- Main headline -->
        <h1 class="font-orbitron font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-none mb-6">
          <span class="block text-white">MY</span>
          <span class="block gradient-text animate-glow-pulse">ENERGY</span>
        </h1>

        <!-- Tagline -->
        <p class="font-rajdhani text-xl sm:text-2xl md:text-3xl text-gray-400 tracking-widest uppercase mb-4">
          Go Beyond The Pixels
        </p>
        <p class="max-w-2xl mx-auto text-gray-500 font-rajdhani text-lg leading-relaxed mb-10">
          Premium energy supplements and gym nutrition engineered for athletes who refuse limits.
          Fuel your body. Unlock your potential. Dominate every session.
        </p>

        <!-- CTA buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <NuxtLink to="/products" class="btn-neon-primary text-sm min-w-48">
            SHOP ALL PRODUCTS
          </NuxtLink>
          <NuxtLink to="/products?featured=true" class="btn-neon-secondary text-sm min-w-48">
            VIEW BESTSELLERS
          </NuxtLink>
        </div>

        <!-- Stats bar -->
        <div class="flex flex-wrap justify-center gap-8 sm:gap-16 mt-16">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="font-orbitron font-black text-2xl sm:text-3xl gradient-text">{{ stat.value }}</div>
            <div class="font-rajdhani text-xs text-gray-600 tracking-widest uppercase mt-1">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span class="text-xs font-orbitron text-gray-600 tracking-widest">SCROLL</span>
        <svg class="w-4 h-4 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>

    <!-- ─── Featured Products ────────────────────────────────── -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <p class="font-orbitron text-neon-purple text-xs tracking-widest uppercase mb-3">Top Sellers</p>
        <h2 class="font-orbitron font-black text-3xl sm:text-4xl text-white">
          FEATURED <span class="gradient-text">FORMULAS</span>
        </h2>
      </div>

      <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="card-neon h-80 animate-pulse bg-dark-700" />
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="product in featured"
          :key="product.id"
          :product="product"
          @quick-add="openQuickAdd"
        />
      </div>

      <div class="text-center mt-10">
        <NuxtLink to="/products" class="btn-neon-secondary text-sm">
          VIEW ALL PRODUCTS
        </NuxtLink>
      </div>
    </section>

    <!-- ─── Categories ──────────────────────────────────────── -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h2 class="font-orbitron font-black text-3xl sm:text-4xl text-white">
          SHOP BY <span class="gradient-text-cyan">GOAL</span>
        </h2>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <NuxtLink
          v-for="cat in goalCategories"
          :key="cat.id"
          :to="`/products?category=${cat.id}`"
          class="group relative overflow-hidden p-6 text-center transition-all duration-300 hover:-translate-y-2"
          :style="`background: ${cat.bg}; border: 1px solid ${cat.border};`"
        >
          <div
            class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            :style="`background: ${cat.hover};`"
          />
          <div class="relative z-10">
            <div class="text-4xl mb-3">{{ cat.emoji }}</div>
            <p class="font-orbitron font-bold text-xs text-white tracking-wider leading-tight">{{ cat.label }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- ─── Why MyEnergy ────────────────────────────────────── -->
    <section class="py-20 relative overflow-hidden">
      <div class="absolute inset-0 circuit-bg opacity-30" />
      <div
        class="absolute inset-0"
        style="background: linear-gradient(180deg, transparent, rgba(176, 38, 255, 0.05), transparent);"
      />

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="font-orbitron font-black text-3xl sm:text-4xl text-white mb-4">
            WHY <span class="gradient-text">MYENERGY</span>?
          </h2>
          <p class="text-gray-500 font-rajdhani text-lg max-w-2xl mx-auto">
            We don't cut corners. Every product is formulated to clinical standards with transparent labels, proven doses, and zero proprietary blend BS.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="feature in whyUs"
            :key="feature.title"
            class="glass-panel p-6 text-center group hover:-translate-y-2 transition-transform duration-300"
          >
            <div class="text-4xl mb-4">{{ feature.emoji }}</div>
            <h3
              class="font-orbitron font-bold text-sm tracking-wider mb-3"
              :style="`color: ${feature.color};`"
            >
              {{ feature.title }}
            </h3>
            <p class="text-gray-500 text-sm font-rajdhani leading-relaxed">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── CTA Banner ──────────────────────────────────────── -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div
        class="relative overflow-hidden p-12 text-center"
        style="background: linear-gradient(135deg, rgba(176, 38, 255, 0.15), rgba(255, 45, 120, 0.1), rgba(0, 245, 255, 0.08)); border: 1px solid rgba(176, 38, 255, 0.3);"
      >
        <div class="absolute inset-0 circuit-bg opacity-20" />
        <div class="scan-overlay" />

        <div class="relative z-10">
          <p class="font-orbitron text-neon-green text-xs tracking-widest uppercase mb-4">Limited Time</p>
          <h2 class="font-orbitron font-black text-4xl sm:text-5xl text-white mb-4">
            FREE SHIPPING<br />
            <span class="gradient-text">OVER R60</span>
          </h2>
          <p class="text-gray-400 font-rajdhani text-lg mb-8">
            Plus get a free shaker with every order over R80. No code needed.
          </p>
          <NuxtLink to="/products" class="btn-neon-primary text-sm">
            CLAIM YOUR FREE SHIPPING
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ─── Quick Add Modal ─────────────────────────────────── -->
    <Transition name="fade">
      <div
        v-if="quickAddProduct"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        style="background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);"
        @click.self="quickAddProduct = null"
      >
        <div
          class="w-full max-w-md p-6 relative"
          style="background: #0f0f1a; border: 1px solid rgba(176, 38, 255, 0.4); box-shadow: 0 0 40px rgba(176, 38, 255, 0.2);"
        >
          <button class="absolute top-4 right-4 text-gray-500 hover:text-white" @click="quickAddProduct = null">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="text-5xl mb-3 text-center">{{ quickAddProduct.emoji }}</div>
          <h3 class="font-orbitron font-bold text-sm text-white mb-1">{{ quickAddProduct.name }}</h3>
          <p class="text-xs text-gray-500 font-rajdhani mb-4">R{{ quickAddProduct.price.toFixed(2) }}</p>

          <!-- Flavour -->
          <div class="mb-4">
            <label class="text-xs font-orbitron text-gray-400 tracking-wider mb-2 block">FLAVOUR</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="f in quickAddProduct.flavours"
                :key="f"
                class="text-xs font-rajdhani px-3 py-1.5 transition-all duration-200"
                :class="selectedFlavour === f ? 'text-dark-900 font-bold' : 'text-gray-400'"
                :style="selectedFlavour === f
                  ? `background: ${quickAddProduct.accentColor}; border: 1px solid ${quickAddProduct.accentColor};`
                  : `background: transparent; border: 1px solid rgba(255,255,255,0.1);`"
                @click="selectedFlavour = f"
              >
                {{ f }}
              </button>
            </div>
          </div>

          <!-- Size -->
          <div class="mb-6">
            <label class="text-xs font-orbitron text-gray-400 tracking-wider mb-2 block">SIZE</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="s in quickAddProduct.sizes"
                :key="s"
                class="text-xs font-rajdhani px-3 py-1.5 transition-all duration-200"
                :class="selectedSize === s ? 'text-dark-900 font-bold' : 'text-gray-400'"
                :style="selectedSize === s
                  ? `background: ${quickAddProduct.accentColor}; border: 1px solid ${quickAddProduct.accentColor};`
                  : `background: transparent; border: 1px solid rgba(255,255,255,0.1);`"
                @click="selectedSize = s"
              >
                {{ s }}
              </button>
            </div>
          </div>

          <button class="btn-neon-primary w-full text-xs" @click="confirmQuickAdd">
            ADD TO CART
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/server/data/products'
import { useCartStore } from '~/stores/cart'

const cart = useCartStore()

const { data: featured, pending } = await useFetch<Product[]>('/api/products', {
  query: { featured: 'true' },
})

const stats = [
  { value: '50K+', label: 'Athletes' },
  { value: '4.8★', label: 'Avg Rating' },
  { value: '12+', label: 'Products' },
  { value: '100%', label: 'Transparent' },
]

const goalCategories = [
  { id: 'pre-workout', label: 'Pre-Workout', emoji: '⚡', bg: 'rgba(176,38,255,0.08)', border: 'rgba(176,38,255,0.25)', hover: 'rgba(176,38,255,0.15)' },
  { id: 'protein', label: 'Build Muscle', emoji: '💪', bg: 'rgba(0,245,255,0.06)', border: 'rgba(0,245,255,0.2)', hover: 'rgba(0,245,255,0.12)' },
  { id: 'fat-burner', label: 'Burn Fat', emoji: '🔥', bg: 'rgba(255,102,0,0.08)', border: 'rgba(255,102,0,0.25)', hover: 'rgba(255,102,0,0.15)' },
  { id: 'energy', label: 'Energy', emoji: '🌊', bg: 'rgba(255,45,120,0.08)', border: 'rgba(255,45,120,0.25)', hover: 'rgba(255,45,120,0.15)' },
  { id: 'recovery', label: 'Recovery', emoji: '🧬', bg: 'rgba(57,255,20,0.06)', border: 'rgba(57,255,20,0.2)', hover: 'rgba(57,255,20,0.12)' },
  { id: 'hydration', label: 'Hydration', emoji: '💧', bg: 'rgba(0,245,255,0.06)', border: 'rgba(0,245,255,0.2)', hover: 'rgba(0,245,255,0.12)' },
]

const whyUs = [
  { emoji: '🔬', title: 'SCIENCE-BACKED', color: '#b026ff', desc: 'Every formula built on peer-reviewed research. Clinical doses only, no underdosed filler ingredients.' },
  { emoji: '🏷️', title: 'FULL TRANSPARENCY', color: '#00f5ff', desc: 'Zero proprietary blends. Every ingredient and dose listed clearly on the label.' },
  { emoji: '🏅', title: 'INFORMED SPORT', color: '#39ff14', desc: 'Batch tested for banned substances. Safe for professional and competitive athletes.' },
  { emoji: '⚡', title: 'ELITE RESULTS', color: '#ff2d78', desc: 'Trusted by 50,000+ athletes worldwide. Proven in the gym, on the track, and on the stage.' },
]

// Quick Add modal
const quickAddProduct = ref<Product | null>(null)
const selectedFlavour = ref('')
const selectedSize = ref('')

function openQuickAdd(product: Product) {
  quickAddProduct.value = product
  selectedFlavour.value = product.flavours[0] || ''
  selectedSize.value = product.sizes[0] || ''
}

function confirmQuickAdd() {
  if (!quickAddProduct.value) return
  cart.addItem({
    id: quickAddProduct.value.id,
    name: quickAddProduct.value.name,
    price: quickAddProduct.value.price,
    emoji: quickAddProduct.value.emoji,
    accentColor: quickAddProduct.value.accentColor,
    flavour: selectedFlavour.value,
    size: selectedSize.value,
  })
  quickAddProduct.value = null
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
