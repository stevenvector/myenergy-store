<template>
  <footer class="relative mt-24 border-t border-neon-purple/20 bg-dark-800">
    <div class="absolute inset-0 circuit-bg opacity-20" />

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
        <!-- Brand -->
        <div class="md:col-span-1">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 flex items-center justify-center font-orbitron font-black text-lg text-white"
              style="background: linear-gradient(135deg, #b026ff, #ff2d78); clip-path: polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%);"
            >
              M
            </div>
            <span class="font-orbitron font-black text-xl tracking-widest">
              <span class="gradient-text">MY</span><span class="text-white">ENERGY</span>
            </span>
          </div>
          <p class="text-sm text-gray-500 font-rajdhani leading-relaxed mb-6">
            Premium energy supplements and gym nutrition. Fuel your performance. Break every limit. Go beyond the pixels.
          </p>
          <!-- Socials -->
          <div class="flex gap-3">
            <a
              v-for="social in socials"
              :key="social.name"
              href="#"
              class="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-neon-purple transition-all duration-200"
              style="border: 1px solid rgba(176, 38, 255, 0.2);"
              :title="social.name"
            >
              <span class="text-sm" v-html="social.icon" />
            </a>
          </div>
        </div>

        <!-- Shop -->
        <div>
          <h4 class="font-orbitron text-xs font-bold tracking-widest text-neon-purple uppercase mb-4">Shop</h4>
          <ul class="space-y-2">
            <li v-for="link in shopLinks" :key="link.to">
              <NuxtLink :to="link.to" class="text-sm text-gray-500 hover:text-white font-rajdhani transition-colors">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Company -->
        <div>
          <h4 class="font-orbitron text-xs font-bold tracking-widest text-neon-cyan uppercase mb-4">Company</h4>
          <ul class="space-y-2">
            <li v-for="link in companyLinks" :key="link.label">
              <a href="#" class="text-sm text-gray-500 hover:text-white font-rajdhani transition-colors">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h4 class="font-orbitron text-xs font-bold tracking-widest text-neon-pink uppercase mb-4">Stay Charged</h4>
          <p class="text-sm text-gray-500 font-rajdhani mb-4 leading-relaxed">
            Get exclusive drops, early access, and performance tips.
          </p>
          <div class="flex gap-2">
            <input
              v-model="email"
              type="email"
              placeholder="your@email.com"
              class="flex-1 bg-dark-700 text-white text-sm font-rajdhani px-4 py-2.5 outline-none placeholder-gray-700 transition-all"
              style="border: 1px solid rgba(176, 38, 255, 0.3); focus:border-color: #b026ff;"
            />
            <button
              class="btn-neon-primary px-4 py-2.5 text-xs whitespace-nowrap"
              @click="subscribe"
            >
              JOIN
            </button>
          </div>
          <p v-if="subscribed" class="text-xs text-neon-green font-rajdhani mt-2">
            ✓ You're in. Welcome to the energy grid.
          </p>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="mt-12 pt-6 border-t border-neon-purple/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-xs text-gray-600 font-rajdhani">
          © {{ new Date().getFullYear() }} MyEnergy. All rights reserved. Go beyond the pixels.
        </p>
        <div class="flex gap-6">
          <a href="#" class="text-xs text-gray-600 hover:text-gray-400 font-rajdhani transition-colors">Privacy</a>
          <a href="#" class="text-xs text-gray-600 hover:text-gray-400 font-rajdhani transition-colors">Terms</a>
          <a href="#" class="text-xs text-gray-600 hover:text-gray-400 font-rajdhani transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const email = ref('')
const subscribed = ref(false)

const socials = [
  { name: 'Instagram', icon: '📸' },
  { name: 'TikTok', icon: '🎵' },
  { name: 'X / Twitter', icon: '𝕏' },
  { name: 'YouTube', icon: '▶' },
]

const shopLinks = [
  { to: '/products?category=pre-workout', label: 'Pre-Workout' },
  { to: '/products?category=protein', label: 'Protein' },
  { to: '/products?category=energy', label: 'Energy Drinks' },
  { to: '/products?category=creatine', label: 'Creatine' },
  { to: '/products?category=fat-burner', label: 'Fat Burners' },
  { to: '/products?category=recovery', label: 'Recovery' },
]

const companyLinks = [
  { label: 'About Us' },
  { label: 'Our Science' },
  { label: 'Athlete Team' },
  { label: 'Blog' },
  { label: 'Contact' },
  { label: 'FAQ' },
]

function subscribe() {
  if (email.value) {
    subscribed.value = true
    email.value = ''
  }
}
</script>
