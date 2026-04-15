<template>
  <div class="min-h-screen bg-dark-900 flex">
    <!-- Sidebar -->
    <aside
      class="fixed top-0 left-0 bottom-0 w-60 flex flex-col z-40 border-r border-neon-purple/20"
      style="background: #0a0a10;"
    >
      <!-- Logo -->
      <div class="px-5 py-5 border-b border-neon-purple/20">
        <NuxtLink to="/admin" class="flex items-center gap-3">
          <div
            class="w-8 h-8 flex items-center justify-center font-orbitron font-black text-sm text-white"
            style="background: linear-gradient(135deg, #b026ff, #ff2d78); clip-path: polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%);"
          >M</div>
          <div>
            <p class="font-orbitron font-black text-sm tracking-widest"><span class="gradient-text">MY</span><span class="text-white">ENERGY</span></p>
            <p class="text-xs text-gray-600 font-rajdhani tracking-wider">ADMIN CMS</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p class="text-xs font-orbitron text-gray-700 tracking-widest uppercase px-3 mb-2">Main</p>
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-3 px-3 py-2.5 text-sm font-rajdhani font-semibold tracking-wide rounded-none transition-all duration-200 group"
          :class="isActive(link.to)
            ? 'text-white border-l-2 border-neon-purple bg-neon-purple/10 pl-2.5'
            : 'text-gray-500 hover:text-white hover:bg-white/5 border-l-2 border-transparent'"
        >
          <span class="text-lg">{{ link.icon }}</span>
          {{ link.label }}
        </NuxtLink>

        <div class="pt-4">
          <p class="text-xs font-orbitron text-gray-700 tracking-widest uppercase px-3 mb-2">Store</p>
          <NuxtLink
            to="/"
            target="_blank"
            class="flex items-center gap-3 px-3 py-2.5 text-sm font-rajdhani font-semibold text-gray-500 hover:text-neon-cyan tracking-wide transition-colors"
          >
            <span class="text-lg">🌐</span>
            View Storefront
          </NuxtLink>
        </div>
      </nav>

      <!-- Logout -->
      <div class="px-4 py-4 border-t border-neon-purple/20">
        <button
          class="w-full flex items-center gap-2 text-sm text-gray-600 hover:text-neon-pink font-rajdhani transition-colors px-3 py-2"
          @click="logout"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 ml-60 flex flex-col min-h-screen">
      <!-- Top bar -->
      <header class="sticky top-0 z-30 flex items-center justify-between px-8 py-4 border-b border-neon-purple/20" style="background: rgba(10,10,16,0.95); backdrop-filter: blur(8px);">
        <h1 class="font-orbitron font-bold text-sm text-white tracking-widest uppercase">
          {{ pageTitle }}
        </h1>
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span class="text-xs text-gray-500 font-rajdhani">Neon DB Connected</span>
        </div>
      </header>

      <!-- Page slot -->
      <main class="flex-1 p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const navLinks = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/products', label: 'Products', icon: '⚡' },
  { to: '/admin/orders', label: 'Orders', icon: '📦' },
]

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/orders': 'Orders',
}

const pageTitle = computed(() => {
  for (const [path, title] of Object.entries(pageTitles)) {
    if (route.path === path || route.path.startsWith(path + '/')) return title
  }
  return 'Admin'
})

function isActive(to: string) {
  if (to === '/admin') return route.path === '/admin'
  return route.path.startsWith(to)
}

async function logout() {
  await $fetch('/api/admin/logout', { method: 'POST' }).catch(() => {})
  const token = useCookie('admin_token')
  token.value = null
  navigateTo('/admin/login')
}
</script>
