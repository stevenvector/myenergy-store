<template>
  <div class="min-h-screen bg-dark-900 flex items-center justify-center px-4 circuit-bg">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 mx-auto flex items-center justify-center font-orbitron font-black text-3xl text-white mb-4"
          style="background: linear-gradient(135deg, #b026ff, #ff2d78); clip-path: polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%);"
        >M</div>
        <h1 class="font-orbitron font-black text-2xl tracking-widest">
          <span class="gradient-text">MY</span><span class="text-white">ENERGY</span>
        </h1>
        <p class="text-gray-600 font-rajdhani text-sm tracking-widest uppercase mt-1">Admin CMS</p>
      </div>

      <!-- Form -->
      <div class="glass-panel p-8">
        <h2 class="font-orbitron font-bold text-sm text-neon-purple tracking-widest uppercase mb-6">
          SECURE LOGIN
        </h2>

        <div class="mb-5">
          <label class="block text-xs font-orbitron text-gray-500 tracking-wider mb-2">PASSWORD</label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter admin password"
            class="w-full bg-dark-800 text-white text-sm font-rajdhani px-4 py-3 outline-none placeholder-gray-700"
            style="border: 1px solid rgba(176,38,255,0.3);"
            @keyup.enter="login"
          />
        </div>

        <p v-if="error" class="text-neon-pink text-xs font-rajdhani mb-4">{{ error }}</p>

        <button
          class="btn-neon-primary w-full flex items-center justify-center gap-2 text-xs"
          :disabled="loading"
          @click="login"
        >
          <span v-if="loading" class="animate-pulse">AUTHENTICATING...</span>
          <span v-else>ENTER THE GRID</span>
        </button>
      </div>

      <p class="text-center text-xs text-gray-700 font-rajdhani mt-6">
        MyEnergy Admin · Protected Area
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const password = ref('')
const loading = ref(false)
const error = ref('')

async function login() {
  if (!password.value) return
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/admin/login', { method: 'POST', body: { password: password.value } })
    navigateTo('/admin')
  }
  catch {
    error.value = 'Invalid password. Access denied.'
  }
  finally {
    loading.value = false
  }
}

useHead({ title: 'Admin Login — MyEnergy' })
</script>
