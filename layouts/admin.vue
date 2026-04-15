<template>
  <div class="min-h-screen bg-dark-900 flex">

    <!-- ── Mobile backdrop ─────────────────────────────────── -->
    <Transition name="fade">
      <div
        v-if="mobileOpen"
        class="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden"
        @click="mobileOpen = false"
      />
    </Transition>

    <!-- ── Sidebar ─────────────────────────────────────────── -->
    <aside
      class="fixed top-0 left-0 bottom-0 z-40 flex flex-col transition-all duration-300"
      :class="[
        /* Desktop width */
        collapsed ? 'md:w-16' : 'md:w-64',
        /* Mobile: slide in/out */
        mobileOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full md:translate-x-0',
      ]"
      style="background: #08080f; border-right: 1px solid rgba(176,38,255,0.2);"
    >
      <!-- Logo -->
      <div
        class="flex items-center gap-3 px-4 py-5 border-b border-neon-purple/20 flex-shrink-0"
        :class="{ 'md:justify-center md:px-2': collapsed }"
      >
        <div
          class="flex-shrink-0 w-9 h-9 flex items-center justify-center font-orbitron font-black text-base text-white"
          style="background: linear-gradient(135deg, #b026ff, #ff2d78); clip-path: polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%);"
        >M</div>
        <div class="overflow-hidden" :class="{ 'md:hidden': collapsed }">
          <p class="font-orbitron font-black text-sm tracking-widest whitespace-nowrap">
            <span class="gradient-text">MY</span><span class="text-white">ENERGY</span>
          </p>
          <p class="text-xs text-gray-600 font-rajdhani tracking-widest uppercase">Admin CMS</p>
        </div>
        <!-- Mobile close -->
        <button
          class="ml-auto p-1 text-gray-600 hover:text-white md:hidden"
          @click="mobileOpen = false"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto py-4 space-y-5 px-2">

        <!-- Main -->
        <div>
          <p class="text-xs font-orbitron text-gray-700 tracking-widest uppercase px-3 mb-2"
            :class="{ 'md:hidden': collapsed }">Main</p>
          <div class="space-y-0.5">
            <NuxtLink
              v-for="link in mainLinks"
              :key="link.to"
              :to="link.to"
              class="flex items-center gap-3 px-3 py-3 rounded-none transition-all duration-200 group relative border-l-2"
              :class="[
                { 'md:justify-center md:px-0': collapsed },
                isActive(link.to)
                  ? 'text-white bg-neon-purple/15 border-neon-purple'
                  : 'text-gray-500 hover:text-white hover:bg-white/5 border-transparent'
              ]"
              @click="mobileOpen = false"
            >
              <span class="text-xl flex-shrink-0">{{ link.icon }}</span>
              <span class="font-rajdhani font-semibold text-sm tracking-wide" :class="{ 'md:hidden': collapsed }">{{ link.label }}</span>
              <!-- Desktop collapsed tooltip -->
              <div
                v-if="collapsed"
                class="hidden md:block absolute left-full ml-3 px-2.5 py-1.5 text-xs font-orbitron text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
                style="background: #0f0f1a; border: 1px solid rgba(176,38,255,0.4);"
              >{{ link.label }}</div>
            </NuxtLink>
          </div>
        </div>

        <!-- Catalogue -->
        <div>
          <p class="text-xs font-orbitron text-gray-700 tracking-widest uppercase px-3 mb-2"
            :class="{ 'md:hidden': collapsed }">Catalogue</p>
          <div class="space-y-0.5">
            <NuxtLink
              v-for="link in catalogueLinks"
              :key="link.to"
              :to="link.to"
              class="flex items-center gap-3 px-3 py-3 rounded-none transition-all duration-200 group relative border-l-2"
              :class="[
                { 'md:justify-center md:px-0': collapsed },
                isActive(link.to)
                  ? 'text-white bg-neon-purple/15 border-neon-purple'
                  : 'text-gray-500 hover:text-white hover:bg-white/5 border-transparent'
              ]"
              @click="mobileOpen = false"
            >
              <span class="text-xl flex-shrink-0">{{ link.icon }}</span>
              <span class="font-rajdhani font-semibold text-sm tracking-wide flex-1" :class="{ 'md:hidden': collapsed }">{{ link.label }}</span>
              <span
                v-if="link.badge && !collapsed"
                class="text-xs font-orbitron font-bold px-1.5 py-0.5 md:block"
                :class="{ 'hidden': collapsed }"
                :style="`color: ${link.badgeColor}; background: ${link.badgeColor}18; border: 1px solid ${link.badgeColor}40;`"
              >{{ link.badge }}</span>
              <div
                v-if="collapsed"
                class="hidden md:block absolute left-full ml-3 px-2.5 py-1.5 text-xs font-orbitron text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
                style="background: #0f0f1a; border: 1px solid rgba(176,38,255,0.4);"
              >{{ link.label }}</div>
            </NuxtLink>
          </div>
        </div>

        <!-- Storefront quick links -->
        <div>
          <p class="text-xs font-orbitron text-gray-700 tracking-widest uppercase px-3 mb-2"
            :class="{ 'md:hidden': collapsed }">Storefront</p>
          <div class="space-y-0.5">
            <a
              v-for="link in storefrontLinks"
              :key="link.href"
              :href="link.href"
              target="_blank"
              class="flex items-center gap-3 px-3 py-3 rounded-none transition-all duration-200 group relative text-gray-500 hover:text-neon-cyan hover:bg-white/5 border-l-2 border-transparent"
              :class="{ 'md:justify-center md:px-0': collapsed }"
            >
              <span class="text-xl flex-shrink-0">{{ link.icon }}</span>
              <span class="font-rajdhani font-semibold text-sm tracking-wide flex-1" :class="{ 'md:hidden': collapsed }">{{ link.label }}</span>
              <svg class="w-3 h-3 opacity-40 flex-shrink-0" :class="{ 'md:hidden': collapsed }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <div
                v-if="collapsed"
                class="hidden md:block absolute left-full ml-3 px-2.5 py-1.5 text-xs font-orbitron text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
                style="background: #0f0f1a; border: 1px solid rgba(0,245,255,0.4);"
              >{{ link.label }}</div>
            </a>
          </div>
        </div>
      </nav>

      <!-- Bottom: collapse (desktop) + logout -->
      <div class="border-t border-neon-purple/20 flex-shrink-0">
        <!-- Collapse toggle — desktop only -->
        <button
          class="hidden md:flex w-full items-center justify-center py-3 text-gray-600 hover:text-gray-300 transition-colors border-b border-neon-purple/10"
          @click="collapsed = !collapsed"
        >
          <svg class="w-4 h-4 transition-transform duration-300" :class="{ 'rotate-180': collapsed }"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        <button
          class="w-full flex items-center gap-3 px-4 py-4 text-gray-600 hover:text-neon-pink transition-colors"
          :class="{ 'md:justify-center md:px-0': collapsed }"
          @click="logout"
        >
          <span class="text-xl">🚪</span>
          <span class="text-sm font-rajdhani font-semibold tracking-wide" :class="{ 'md:hidden': collapsed }">Logout</span>
        </button>
      </div>
    </aside>

    <!-- ── Main area ────────────────────────────────────────── -->
    <div
      class="flex-1 flex flex-col min-h-screen w-0 transition-all duration-300"
      :class="collapsed ? 'md:ml-16' : 'md:ml-64'"
    >
      <!-- Top bar -->
      <header
        class="sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-neon-purple/20 flex-shrink-0"
        style="background: rgba(8,8,15,0.96); backdrop-filter: blur(8px);"
      >
        <!-- Hamburger — mobile only -->
        <button
          class="md:hidden flex-shrink-0 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          style="border: 1px solid rgba(176,38,255,0.25);"
          @click="mobileOpen = true"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 class="font-orbitron font-bold text-sm text-white tracking-widest uppercase flex-1 truncate">
          {{ pageTitle }}
        </h1>

        <div class="flex items-center gap-3 flex-shrink-0">
          <div class="hidden sm:flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            <span class="text-xs text-gray-600 font-rajdhani">Neon DB</span>
          </div>
          <NuxtLink
            to="/admin/products"
            class="flex items-center gap-1.5 text-xs font-orbitron px-3 py-2 text-neon-purple transition-all hover:bg-neon-purple/10 whitespace-nowrap"
            style="border: 1px solid rgba(176,38,255,0.3);"
          >
            <span>+</span>
            <span class="hidden sm:inline">Product</span>
          </NuxtLink>
        </div>
      </header>

      <!-- Page slot -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto min-w-0">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const collapsed = ref(false)
const mobileOpen = ref(false)

// Close mobile menu on route change
watch(() => route.path, () => { mobileOpen.value = false })

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

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
