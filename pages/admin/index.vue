<template>
  <div>
    <!-- Stat cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
      <div
        v-for="stat in statCards"
        :key="stat.label"
        class="glass-panel p-5"
      >
        <div class="flex items-start justify-between mb-3">
          <span class="text-3xl">{{ stat.icon }}</span>
          <span
            class="text-xs font-orbitron font-bold px-2 py-0.5"
            :style="`color: ${stat.color}; border: 1px solid ${stat.color}40; background: ${stat.color}10;`"
          >LIVE</span>
        </div>
        <p class="font-orbitron font-black text-2xl text-white mb-1">{{ stat.value }}</p>
        <p class="text-xs text-gray-500 font-rajdhani tracking-wider">{{ stat.label }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <!-- Recent orders -->
      <div class="glass-panel p-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="font-orbitron font-bold text-sm text-white tracking-widest">RECENT ORDERS</h2>
          <NuxtLink to="/admin/orders" class="text-xs text-neon-cyan font-rajdhani hover:text-white transition-colors">
            View all →
          </NuxtLink>
        </div>

        <div v-if="pending" class="space-y-3">
          <div v-for="i in 4" :key="i" class="h-12 animate-pulse bg-dark-600 rounded" />
        </div>

        <div v-else-if="!stats?.recentOrders?.length" class="py-8 text-center text-gray-600 font-rajdhani text-sm">
          No orders yet
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="order in stats.recentOrders"
            :key="order.id"
            class="flex items-center justify-between px-3 py-2.5 hover:bg-white/3 transition-colors"
            style="border: 1px solid rgba(176,38,255,0.1);"
          >
            <div>
              <p class="font-orbitron text-xs text-white">{{ order.id }}</p>
              <p class="text-xs text-gray-500 font-rajdhani">{{ order.first_name }} {{ order.last_name }}</p>
            </div>
            <div class="text-right">
              <p class="font-orbitron text-sm text-neon-cyan">R{{ parseFloat(order.total).toFixed(2) }}</p>
              <span
                class="text-xs font-orbitron px-2 py-0.5"
                :style="statusStyle(order.status)"
              >{{ order.status.toUpperCase() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top products -->
      <div class="glass-panel p-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="font-orbitron font-bold text-sm text-white tracking-widest">TOP PRODUCTS</h2>
          <NuxtLink to="/admin/products" class="text-xs text-neon-cyan font-rajdhani hover:text-white transition-colors">
            Manage →
          </NuxtLink>
        </div>

        <div v-if="pending" class="space-y-3">
          <div v-for="i in 5" :key="i" class="h-10 animate-pulse bg-dark-600 rounded" />
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="p in stats?.topProducts"
            :key="p.id"
            class="flex items-center gap-3 px-3 py-2.5 hover:bg-white/3 transition-colors"
            style="border: 1px solid rgba(176,38,255,0.1);"
          >
            <span class="text-xl">{{ p.emoji }}</span>
            <div class="flex-1 min-w-0">
              <p class="font-orbitron text-xs text-white truncate">{{ p.name }}</p>
              <p class="text-xs text-gray-600 font-rajdhani">{{ p.reviews }} reviews · ★{{ p.rating }}</p>
            </div>
            <div class="text-right">
              <p class="font-orbitron text-sm text-white">R{{ parseFloat(p.price).toFixed(2) }}</p>
              <p class="text-xs font-rajdhani" :class="p.stock < 10 ? 'text-neon-pink' : 'text-gray-600'">
                {{ p.stock }} in stock
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { data: stats, pending } = await useFetch('/api/admin/stats')

const statCards = computed(() => [
  { icon: '⚡', label: 'Total Products', value: stats.value?.totalProducts ?? '—', color: '#b026ff' },
  { icon: '📦', label: 'Total Orders', value: stats.value?.totalOrders ?? '—', color: '#00f5ff' },
  { icon: '💰', label: 'Total Revenue', value: stats.value?.revenue != null ? `R${Number(stats.value.revenue).toFixed(2)}` : '—', color: '#39ff14' },
  { icon: '⚠️', label: 'Low Stock Items', value: stats.value?.lowStock ?? '—', color: '#ff6600' },
])

const statusColors: Record<string, string> = {
  confirmed: '#00f5ff',
  processing: '#ffe600',
  shipped: '#b026ff',
  delivered: '#39ff14',
  cancelled: '#ff2d78',
}

function statusStyle(status: string) {
  const c = statusColors[status] || '#9ca3af'
  return `color: ${c}; border: 1px solid ${c}40; background: ${c}10;`
}

useHead({ title: 'Dashboard — MyEnergy Admin' })
</script>
