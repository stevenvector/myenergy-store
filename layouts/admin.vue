<template>
  <div class="min-h-screen bg-dark-900 flex">

    <!-- ── Sidebar ─────────────────────────────────────────── -->
    <aside
      class="fixed top-0 left-0 bottom-0 z-40 flex flex-col transition-all duration-300"
      :class="collapsed ? 'w-16' : 'w-64'"
      style="background: #08080f; border-right: 1px solid rgba(176,38,255,0.2);"
    >
      <!-- Logo / Brand -->
      <div
        class="flex items-center px-4 border-b border-neon-purple/20 flex-shrink-0"
        :class="collapsed ? 'justify-center py-4' : 'gap-3 py-5'"
      >
        <div
          class="flex-shrink-0 w-9 h-9 flex items-center justify-center font-orbitron font-black text-base text-white"
          style="background: linear-gradient(135deg, #b026ff, #ff2d78); clip-path: polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%);"
        >M</div>
        <div v-if="!collapsed" class="overflow-hidden">
          <p class="font-orbitron font-black text-sm tracking-widest whitespace-nowrap">
            <span class="gradient-text">MY</span><span class="text-white">ENERGY</span>
          </p>
          <p class="text-xs text-gray-600 font-rajdhani tracking-widest uppercase">Admin CMS</p>
        </div>
      </div>

      <!-- Nav sections -->
      <nav class="flex-1 overflow-y-auto py-4 space-y-6 px-2">

        <!-- Main -->
        <div>
          <p v-if="!collapsed" class="text-xs font-orbitron text-gray-700 tracking-widest uppercase px-3 mb-2">Main</p>
          <div class="space-y-0.5">
            <NuxtLink
              v-for="link in mainLinks"
              :key="link.to"
              :to="link.to"
              class="flex items-center rounded-none transition-all duration-200 group relative"
              :class="[
                collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3 py-2.5',
                isActive(link.to)
                  ? 'text-white bg-neon-purple/15 border-l-2 border-neon-purple'
                  : 'text-gray-500 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
              ]"
              :title="collapsed ? link.label : ''"
            >
              <span class="text-lg flex-shrink-0">{{ link.icon }}</span>
              <span v-if="!collapsed" class="font-rajdhani font-semibold text-sm tracking-wide whitespace-nowrap">{{ link.label }}</span>

              <!-- Active indicator dot -->
              <span
                v-if="isActive(link.to) && collapsed"
                class="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-neon-purple"
              />

              <!-- Tooltip on collapsed -->
              <div
                v-if="collapsed"
                class="absolute left-full ml-3 px-2.5 py-1.5 text-xs font-orbitron text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
                style="background: #0f0f1a; border: 1px solid rgba(176,38,255,0.4);"
              >{{ link.label }}</div>
            </NuxtLink>
          </div>
        </div>

        <!-- Catalogue -->
        <div>
          <p v-if="!collapsed" class="text-xs font-orbitron text-gray-700 tracking-widest uppercase px-3 mb-2">Catalogue</p>
          <div class="space-y-0.5">
            <NuxtLink
              v-for="link in catalogueLinks"
              :key="link.to"
              :to="link.to"
              class="flex items-center rounded-none transition-all duration-200 group relative"
              :class="[
                collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3 py-2.5',
                isActive(link.to)
                  ? 'text-white bg-neon-purple/15 border-l-2 border-neon-purple'
                  : 'text-gray-500 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
              ]"
              :title="collapsed ? link.label : ''"
            >
              <span class="text-lg flex-shrink-0">{{ link.icon }}</span>
              <span v-if="!collapsed" class="font-rajdhani font-semibold text-sm tracking-wide flex-1 whitespace-nowrap">{{ link.label }}</span>
              <span
                v-if="!collapsed && link.badge"
                class="text-xs font-orbitron font-bold px-1.5 py-0.5"
                :style="`color: ${link.badgeColor}; background: ${link.badgeColor}18; border: 1px solid ${link.badgeColor}40;`"
              >{{ link.badge }}</span>
              <div
                v-if="collapsed"
                class="absolute left-full ml-3 px-2.5 py-1.5 text-xs font-orbitron text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
                style="background: #0f0f1a; border: 1px solid rgba(176,38,255,0.4);"
              >{{ link.label }}</div>
            </NuxtLink>
          </div>
        </div>

        <!-- Store -->
        <div>
          <p v-if="!collapsed" class="text-xs font-orbitron text-gray-700 tracking-widest uppercase px-3 mb-2">Storefront</p>
          <div class="space-y-0.5">
            <a
              v-for="link in storefrontLinks"
              :key="link.href"
              :href="link.href"
              target="_blank"
              class="flex items-center rounded-none transition-all duration-200 group relative text-gray-500 hover:text-neon-cyan hover:bg-white/5 border-l-2 border-transparent"
              :class="collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3 py-2.5'"
            >
              <span class="text-lg flex-shrink-0">{{ link.icon }}</span>
              <span v-if="!collapsed" class="font-rajdhani font-semibold text-sm tracking-wide whitespace-nowrap">{{ link.label }}</span>
              <svg v-if="!collapsed" class="w-3 h-3 ml-auto opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <div
                v-if="collapsed"
                class="absolute left-full ml-3 px-2.5 py-1.5 text-xs font-orbitron text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
                style="background: #0f0f1a; border: 1px solid rgba(0,245,255,0.4);"
              >{{ link.label }}</div>
            </a>
          </div>
        </div>
      </nav>

      <!-- Bottom: collapse toggle + logout -->
      <div class="border-t border-neon-purple/20 flex-shrink-0">
        <!-- Collapse toggle -->
        <button
          class="w-full flex items-center justify-center py-3 text-gray-600 hover:text-gray-300 transition-colors border-b border-neon-purple/10"
          :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          @click="collapsed = !collapsed"
        >
          <svg
            class="w-4 h-4 transition-transform duration-300"
            :class="collapsed ? 'rotate-180' : ''"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        <!-- Logout -->
        <button
          class="w-full flex items-center py-3 text-gray-600 hover:text-neon-pink transition-colors"
          :class="collapsed ? 'justify-center px-0' : 'gap-3 px-4'"
          @click="logout"
        >
          <span class="text-base">🚪</span>
          <span v-if="!collapsed" class="text-sm font-rajdhani font-semibold tracking-wide">Logout</span>
        </button>
      </div>
    </aside>

    <!-- ── Main content ─────────────────────────────────────── -->
    <div
      class="flex-1 flex flex-col min-h-screen transition-all duration-300"
      :class="collapsed ? 'ml-16' : 'ml-64'"
    >
      <!-- Top bar -->
      <header
        class="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-neon-purple/20 flex-shrink-0"
        style="background: rgba(8,8,15,0.95); backdrop-filter: blur(8px);"
      >
        <div class="flex items-center gap-3">
          <h1 class="font-orbitron font-bold text-sm text-white tracking-widest uppercase">
            {{ pageTitle }}
          </h1>
          <!-- Breadcrumb -->
          <div class="hidden sm:flex items-center gap-1 text-xs text-gray-600 font-rajdhani">
            <span>/</span>
            <span>{{ pageTitle }}</span>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <!-- DB status -->
          <div class="hidden sm:flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            <span class="text-xs text-gray-600 font-rajdhani tracking-wider">Neon DB</span>
          </div>

          <!-- Quick actions -->
          <NuxtLink
            to="/admin/products"
            class="hidden sm:flex items-center gap-1.5 text-xs font-orbitron px-3 py-1.5 text-neon-purple transition-all hover:bg-neon-purple/10"
            style="border: 1px solid rgba(176,38,255,0.3);"
          >
            <span>+</span> Product
          </NuxtLink>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-6 lg:p-8 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const collapsed = ref(false)

const mainLinks = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
]

const catalogueLinks = [
  { to: '/admin/products', label: 'Products', icon: '⚡', badge: 'CRUD', badgeColor: '#b026ff' },
  { to: '/admin/orders', label: 'Orders', icon: '📦', badge: null, badgeColor: '' },
]

const storefrontLinks = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/products', label: 'Shop', icon: '🛍️' },
  { href: '/checkout', label: 'Checkout', icon: '💳' },
]

const pageTitleMap: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/orders': 'Orders',
}

const pageTitle = computed(() => {
  for (const [path, title] of Object.entries(pageTitleMap)) {
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
