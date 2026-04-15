<template>
  <div>
    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-6">
      <button
        v-for="s in statusFilters"
        :key="s.value"
        class="text-xs font-orbitron px-4 py-2 transition-all"
        :style="activeStatus === s.value
          ? `background: ${s.color}20; border: 1px solid ${s.color}; color: ${s.color};`
          : 'background: transparent; border: 1px solid rgba(176,38,255,0.2); color: #6b7280;'"
        @click="activeStatus = s.value"
      >
        {{ s.label }}
        <span class="ml-1 opacity-60">{{ orderCount(s.value) }}</span>
      </button>
    </div>

    <!-- Orders table -->
    <div class="glass-panel overflow-hidden">
      <div v-if="pending" class="p-8 space-y-3">
        <div v-for="i in 6" :key="i" class="h-14 animate-pulse bg-dark-600" />
      </div>

      <div v-else-if="!filteredOrders.length" class="py-16 text-center text-gray-600 font-rajdhani">
        No orders found
      </div>

      <table v-else class="w-full">
        <thead>
          <tr style="border-bottom: 1px solid rgba(176,38,255,0.2); background: rgba(176,38,255,0.05);">
            <th class="text-left px-4 py-3 text-xs font-orbitron text-gray-500 tracking-widest uppercase">Order</th>
            <th class="text-left px-4 py-3 text-xs font-orbitron text-gray-500 tracking-widest uppercase hidden md:table-cell">Customer</th>
            <th class="text-left px-4 py-3 text-xs font-orbitron text-gray-500 tracking-widest uppercase hidden lg:table-cell">Items</th>
            <th class="text-right px-4 py-3 text-xs font-orbitron text-gray-500 tracking-widest uppercase">Total</th>
            <th class="text-center px-4 py-3 text-xs font-orbitron text-gray-500 tracking-widest uppercase">Status</th>
            <th class="text-right px-4 py-3 text-xs font-orbitron text-gray-500 tracking-widest uppercase hidden md:table-cell">Date</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="order in filteredOrders" :key="order.id">
            <tr
              class="hover:bg-white/3 cursor-pointer transition-colors"
              style="border-bottom: 1px solid rgba(176,38,255,0.08);"
              @click="toggleExpand(order.id)"
            >
              <td class="px-4 py-3">
                <p class="font-orbitron text-xs text-neon-cyan">{{ order.id }}</p>
              </td>
              <td class="px-4 py-3 hidden md:table-cell">
                <p class="text-sm text-white font-rajdhani">{{ order.firstName }} {{ order.lastName }}</p>
                <p class="text-xs text-gray-600 font-rajdhani">{{ order.email }}</p>
              </td>
              <td class="px-4 py-3 hidden lg:table-cell">
                <div class="flex gap-1">
                  <span v-for="item in (order.items || []).slice(0, 4)" :key="item.id" class="text-sm">{{ item.emoji }}</span>
                  <span v-if="(order.items || []).length > 4" class="text-xs text-gray-600">+{{ order.items.length - 4 }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <span class="font-orbitron text-sm text-white">R{{ order.total.toFixed(2) }}</span>
              </td>
              <td class="px-4 py-3 text-center">
                <select
                  :value="order.status"
                  class="text-xs font-orbitron px-2 py-1 bg-transparent outline-none cursor-pointer"
                  :style="statusStyle(order.status)"
                  @change="updateStatus(order.id, ($event.target as HTMLSelectElement).value)"
                  @click.stop
                >
                  <option v-for="s in orderStatuses" :key="s" :value="s" style="background: #0f0f1a;">{{ s.toUpperCase() }}</option>
                </select>
              </td>
              <td class="px-4 py-3 text-right hidden md:table-cell">
                <span class="text-xs text-gray-600 font-rajdhani">{{ formatDate(order.createdAt) }}</span>
              </td>
            </tr>

            <!-- Expanded row -->
            <tr v-if="expandedId === order.id" style="background: rgba(176,38,255,0.04); border-bottom: 1px solid rgba(176,38,255,0.15);">
              <td colspan="6" class="px-6 py-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p class="text-xs font-orbitron text-gray-500 tracking-widest uppercase mb-2">Shipping Address</p>
                    <p class="text-sm font-rajdhani text-gray-300">{{ order.address }}</p>
                    <p class="text-sm font-rajdhani text-gray-300">{{ order.city }}, {{ order.postcode }}</p>
                    <p class="text-sm font-rajdhani text-gray-300">{{ order.country }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-orbitron text-gray-500 tracking-widest uppercase mb-2">Order Items</p>
                    <div class="space-y-1">
                      <div v-for="item in (order.items || [])" :key="item.id" class="flex justify-between text-sm font-rajdhani">
                        <span class="text-gray-300">{{ item.emoji }} {{ item.productName }} × {{ item.quantity }}</span>
                        <span class="text-white">R{{ (parseFloat(item.price) * item.quantity).toFixed(2) }}</span>
                      </div>
                      <div class="flex justify-between text-sm font-rajdhani pt-1 border-t border-neon-purple/20">
                        <span class="text-gray-500">Shipping</span>
                        <span class="text-white">R{{ order.shippingCost.toFixed(2) }}</span>
                      </div>
                      <div class="flex justify-between font-orbitron text-sm pt-1">
                        <span class="text-white">TOTAL</span>
                        <span class="text-neon-cyan">R{{ order.total.toFixed(2) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { data: orders, pending, refresh } = await useFetch<any[]>('/api/admin/orders')

const activeStatus = ref('all')
const expandedId = ref<string | null>(null)

const orderStatuses = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const statusFilters = [
  { value: 'all', label: 'ALL', color: '#b026ff' },
  { value: 'confirmed', label: 'CONFIRMED', color: '#00f5ff' },
  { value: 'processing', label: 'PROCESSING', color: '#ffe600' },
  { value: 'shipped', label: 'SHIPPED', color: '#b026ff' },
  { value: 'delivered', label: 'DELIVERED', color: '#39ff14' },
  { value: 'cancelled', label: 'CANCELLED', color: '#ff2d78' },
]

const statusColors: Record<string, string> = {
  confirmed: '#00f5ff', processing: '#ffe600', shipped: '#b026ff',
  delivered: '#39ff14', cancelled: '#ff2d78',
}

const filteredOrders = computed(() => {
  if (!orders.value) return []
  if (activeStatus.value === 'all') return orders.value
  return orders.value.filter(o => o.status === activeStatus.value)
})

function orderCount(status: string) {
  if (!orders.value) return 0
  if (status === 'all') return orders.value.length
  return orders.value.filter(o => o.status === status).length
}

function statusStyle(status: string) {
  const c = statusColors[status] || '#9ca3af'
  return `color: ${c}; border: 1px solid ${c}40; background: ${c}10;`
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })
}

function toggleExpand(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}

async function updateStatus(orderId: string, status: string) {
  await $fetch(`/api/admin/orders/${orderId}`, { method: 'PATCH', body: { status } })
  await refresh()
}

useHead({ title: 'Orders — MyEnergy Admin' })
</script>
