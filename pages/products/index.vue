<template>
  <div class="pt-20 min-h-screen">
    <!-- Page header -->
    <div class="relative py-16 overflow-hidden">
      <div class="absolute inset-0 circuit-bg opacity-30" />
      <div class="absolute inset-0" style="background: linear-gradient(135deg, rgba(176,38,255,0.08), transparent, rgba(0,245,255,0.05));" />
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="font-orbitron text-neon-purple text-xs tracking-widest uppercase mb-3">All Supplements</p>
        <h1 class="font-orbitron font-black text-4xl sm:text-5xl text-white">
          THE <span class="gradient-text">ARSENAL</span>
        </h1>
        <p class="text-gray-500 font-rajdhani text-lg mt-3 max-w-xl mx-auto">
          Premium-grade formulas for every goal, every athlete, every session.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <!-- Filters bar -->
      <div class="flex flex-col lg:flex-row gap-4 mb-10">
        <!-- Search -->
        <div class="relative flex-1 max-w-md">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search supplements..."
            class="w-full bg-dark-700 text-white text-sm font-rajdhani pl-10 pr-4 py-3 outline-none placeholder-gray-600 transition-all"
            style="border: 1px solid rgba(176, 38, 255, 0.25);"
          />
        </div>

        <!-- Sort -->
        <select
          v-model="sortBy"
          class="bg-dark-700 text-white text-sm font-rajdhani px-4 py-3 outline-none transition-all"
          style="border: 1px solid rgba(176, 38, 255, 0.25);"
        >
          <option value="">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="reviews">Most Reviewed</option>
        </select>

        <!-- Results count -->
        <div class="flex items-center text-sm text-gray-500 font-rajdhani whitespace-nowrap">
          <span v-if="!pending">{{ products?.length || 0 }} products</span>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar filters -->
        <aside class="lg:w-52 flex-shrink-0">
          <div class="glass-panel p-5 sticky top-24">
            <h3 class="font-orbitron text-xs font-bold text-neon-purple tracking-widest uppercase mb-4">CATEGORY</h3>
            <ul class="space-y-1">
              <li v-for="cat in categoryOptions" :key="cat.id">
                <button
                  class="w-full text-left px-3 py-2.5 text-sm font-rajdhani transition-all duration-200 flex items-center justify-between group"
                  :class="activeCategory === cat.id
                    ? 'text-white bg-neon-purple/15 border-l-2 border-neon-purple pl-2.5'
                    : 'text-gray-500 hover:text-white hover:bg-white/5 border-l-2 border-transparent'"
                  @click="activeCategory = cat.id"
                >
                  <span class="flex items-center gap-2">
                    <span>{{ cat.emoji }}</span>
                    {{ cat.label }}
                  </span>
                  <svg class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <!-- Product grid -->
        <div class="flex-1">
          <!-- Loading -->
          <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i" class="h-80 animate-pulse" style="background: rgba(15,15,26,0.8); border: 1px solid rgba(176,38,255,0.1);" />
          </div>

          <!-- Empty state -->
          <div v-else-if="!products?.length" class="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div class="text-6xl">🔍</div>
            <p class="font-orbitron text-gray-500 text-sm tracking-wider">NO PRODUCTS FOUND</p>
            <p class="text-gray-600 font-rajdhani">Try a different search or category</p>
            <button class="btn-neon-secondary text-xs" @click="searchQuery = ''; activeCategory = 'all'">
              CLEAR FILTERS
            </button>
          </div>

          <!-- Grid -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
              @quick-add="openQuickAdd"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Add Modal -->
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

          <div class="mb-4">
            <label class="text-xs font-orbitron text-gray-400 tracking-wider mb-2 block">FLAVOUR</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="f in quickAddProduct.flavours"
                :key="f"
                class="text-xs font-rajdhani px-3 py-1.5 transition-all"
                :style="selectedFlavour === f
                  ? `background: ${quickAddProduct.accentColor}; border: 1px solid ${quickAddProduct.accentColor}; color: #000;`
                  : 'background: transparent; border: 1px solid rgba(255,255,255,0.12); color: #9ca3af;'"
                @click="selectedFlavour = f"
              >{{ f }}</button>
            </div>
          </div>

          <div class="mb-6">
            <label class="text-xs font-orbitron text-gray-400 tracking-wider mb-2 block">SIZE</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="s in quickAddProduct.sizes"
                :key="s"
                class="text-xs font-rajdhani px-3 py-1.5 transition-all"
                :style="selectedSize === s
                  ? `background: ${quickAddProduct.accentColor}; border: 1px solid ${quickAddProduct.accentColor}; color: #000;`
                  : 'background: transparent; border: 1px solid rgba(255,255,255,0.12); color: #9ca3af;'"
                @click="selectedSize = s"
              >{{ s }}</button>
            </div>
          </div>

          <button class="btn-neon-primary w-full text-xs" @click="confirmQuickAdd">ADD TO CART</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/server/data/products'
import { useCartStore } from '~/stores/cart'

const cart = useCartStore()
const route = useRoute()

const searchQuery = ref((route.query.search as string) || '')
const sortBy = ref('')
const activeCategory = ref((route.query.category as string) || 'all')

// Sync URL query params
watch(activeCategory, (val) => {
  navigateTo({ query: { ...route.query, category: val === 'all' ? undefined : val } }, { replace: true })
})

const { data: products, pending } = await useFetch<Product[]>('/api/products', {
  query: computed(() => ({
    category: activeCategory.value !== 'all' ? activeCategory.value : undefined,
    search: searchQuery.value || undefined,
    sort: sortBy.value || undefined,
    featured: (route.query.featured as string) || undefined,
  })),
  watch: [searchQuery, sortBy, activeCategory],
})

const categoryOptions = [
  { id: 'all', label: 'All Products', emoji: '⚡' },
  { id: 'pre-workout', label: 'Pre-Workout', emoji: '💥' },
  { id: 'protein', label: 'Protein', emoji: '💪' },
  { id: 'creatine', label: 'Creatine', emoji: '🔥' },
  { id: 'energy', label: 'Energy Drinks', emoji: '🌊' },
  { id: 'fat-burner', label: 'Fat Burners', emoji: '🔥' },
  { id: 'recovery', label: 'Recovery', emoji: '🧬' },
  { id: 'hydration', label: 'Hydration', emoji: '💧' },
]

// Quick Add
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
