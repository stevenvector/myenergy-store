<template>
  <NuxtLink :to="`/products/${product.id}`" class="card-neon group block">
    <!-- Badge -->
    <div v-if="product.badge" class="absolute top-3 left-3 z-10">
      <span class="badge-neon text-dark-900 font-black" :style="badgeStyle">
        {{ product.badge }}
      </span>
    </div>

    <!-- Discount tag -->
    <div v-if="product.originalPrice" class="absolute top-3 right-3 z-10">
      <span class="badge-neon text-neon-green" style="border: 1px solid rgba(57,255,20,0.5); background: rgba(0,0,0,0.85);">
        -{{ Math.round((1 - product.price / product.originalPrice) * 100) }}%
      </span>
    </div>

    <!-- Emoji visual area -->
    <div
      class="relative h-44 flex items-center justify-center overflow-hidden"
      :style="`background: linear-gradient(135deg, ${product.accentColor}18, ${product.accentColor}05);`"
    >
      <div
        class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        :style="`background: radial-gradient(circle at 50% 50%, ${product.accentColor}25, transparent 70%);`"
      />
      <div class="absolute inset-0 circuit-bg opacity-30" />
      <div class="text-7xl animate-float relative z-10">{{ product.emoji }}</div>
    </div>

    <!-- Info -->
    <div class="p-5">
      <p class="text-xs font-orbitron tracking-widest uppercase mb-2" :style="`color: ${product.accentColor};`">
        {{ product.categoryLabel }}
      </p>

      <h3 class="font-orbitron font-bold text-sm text-white leading-tight group-hover:text-neon-cyan transition-colors duration-200 line-clamp-2">
        {{ product.name }}
      </h3>

      <p class="text-xs text-gray-500 font-rajdhani mt-1 line-clamp-2 leading-relaxed">
        {{ product.tagline }}
      </p>

      <!-- Rating -->
      <div class="flex items-center gap-2 mt-3">
        <div class="flex gap-0.5">
          <span v-for="i in 5" :key="i" class="text-xs" :class="i <= Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-700'">★</span>
        </div>
        <span class="text-xs text-gray-500 font-rajdhani">{{ product.rating }} ({{ product.reviews.toLocaleString() }})</span>
      </div>

      <!-- Price & add -->
      <div class="flex items-center justify-between mt-4">
        <div class="flex items-end gap-2">
          <span class="font-orbitron font-black text-xl text-white">R{{ product.price.toFixed(2) }}</span>
          <span v-if="product.originalPrice" class="text-sm text-gray-600 line-through font-rajdhani">
            R{{ product.originalPrice.toFixed(2) }}
          </span>
        </div>

        <button
          class="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 p-2 text-white"
          :style="`background: ${product.accentColor}25; border: 1px solid ${product.accentColor}50;`"
          @click.prevent="$emit('quick-add', product)"
          title="Quick add"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Product } from '~/server/data/products'

const props = defineProps<{ product: Product }>()
defineEmits<{ 'quick-add': [product: Product] }>()

const badgeColorMap: Record<string, string> = {
  'neon-pink': '#ff2d78',
  'neon-green': '#39ff14',
  'neon-cyan': '#00f5ff',
  'neon-orange': '#ff6600',
  'neon-purple': '#b026ff',
}

const badgeStyle = computed(() => {
  const color = badgeColorMap[props.product.badgeColor || ''] || '#b026ff'
  return `background: ${color};`
})
</script>
