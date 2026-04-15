<template>
  <div>
    <!-- Header actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <p class="text-gray-500 font-rajdhani text-sm">{{ products?.length || 0 }} products in database</p>
      <button class="btn-neon-primary text-xs flex items-center justify-center gap-2 w-full sm:w-auto py-3 sm:py-2" @click="openCreate">
        <span>+</span> ADD PRODUCT
      </button>
    </div>

    <!-- Products table -->
    <div class="glass-panel overflow-hidden">
      <div v-if="pending" class="p-8 space-y-3">
        <div v-for="i in 6" :key="i" class="h-14 animate-pulse bg-dark-600" />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[480px]">
          <thead>
            <tr style="border-bottom: 1px solid rgba(176,38,255,0.2); background: rgba(176,38,255,0.05);">
              <th class="text-left px-4 py-3 text-xs font-orbitron text-gray-500 tracking-widest uppercase">Product</th>
              <th class="text-left px-4 py-3 text-xs font-orbitron text-gray-500 tracking-widest uppercase hidden md:table-cell">Category</th>
              <th class="text-right px-4 py-3 text-xs font-orbitron text-gray-500 tracking-widest uppercase">Price</th>
              <th class="text-right px-4 py-3 text-xs font-orbitron text-gray-500 tracking-widest uppercase hidden lg:table-cell">Stock</th>
              <th class="text-center px-4 py-3 text-xs font-orbitron text-gray-500 tracking-widest uppercase hidden lg:table-cell">Featured</th>
              <th class="text-right px-4 py-3 text-xs font-orbitron text-gray-500 tracking-widest uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in products"
              :key="p.id"
              class="hover:bg-white/3 transition-colors"
              style="border-bottom: 1px solid rgba(176,38,255,0.08);"
            >
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">{{ p.emoji }}</span>
                  <div class="min-w-0">
                    <p class="font-orbitron text-xs text-white truncate max-w-[120px] sm:max-w-none">{{ p.name }}</p>
                    <p class="text-xs text-gray-600 font-rajdhani truncate max-w-[120px] sm:max-w-none">{{ p.id }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 hidden md:table-cell">
                <span class="text-xs font-rajdhani text-gray-400">{{ p.categoryLabel }}</span>
              </td>
              <td class="px-4 py-3 text-right">
                <p class="font-orbitron text-sm text-white">R{{ p.price.toFixed(2) }}</p>
                <p v-if="p.originalPrice" class="text-xs text-gray-600 line-through font-rajdhani">R{{ p.originalPrice.toFixed(2) }}</p>
              </td>
              <td class="px-4 py-3 text-right hidden lg:table-cell">
                <span
                  class="font-orbitron text-sm"
                  :class="p.stock < 10 ? 'text-neon-pink' : p.stock < 30 ? 'text-yellow-400' : 'text-neon-green'"
                >{{ p.stock }}</span>
              </td>
              <td class="px-4 py-3 text-center hidden lg:table-cell">
                <button
                  class="text-lg transition-all p-1"
                  :title="p.featured ? 'Remove from featured' : 'Mark as featured'"
                  @click="toggleFeatured(p)"
                >
                  {{ p.featured ? '⭐' : '☆' }}
                </button>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-2">
                  <button
                    class="text-xs font-orbitron px-3 py-2.5 min-h-[44px] text-neon-cyan transition-all hover:bg-neon-cyan/10 flex items-center"
                    style="border: 1px solid rgba(0,245,255,0.3);"
                    @click="openEdit(p)"
                  >EDIT</button>
                  <button
                    class="text-xs font-orbitron px-3 py-2.5 min-h-[44px] text-neon-pink transition-all hover:bg-neon-pink/10 flex items-center"
                    style="border: 1px solid rgba(255,45,120,0.3);"
                    @click="confirmDelete(p)"
                  >DEL</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <Transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto"
        style="background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);"
        @click.self="showModal = false"
      >
        <div
          class="w-full max-w-2xl my-auto p-4 sm:p-6"
          style="background: #0f0f1a; border: 1px solid rgba(176,38,255,0.4); box-shadow: 0 0 60px rgba(176,38,255,0.2);"
        >
          <div class="flex items-center justify-between mb-5">
            <h3 class="font-orbitron font-bold text-white tracking-widest text-sm">
              {{ editingProduct ? 'EDIT PRODUCT' : 'CREATE PRODUCT' }}
            </h3>
            <button class="text-gray-500 hover:text-white p-1 text-lg leading-none" @click="showModal = false">✕</button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="admin-label">ID (slug)</label>
              <input v-model="form.id" :disabled="!!editingProduct" class="admin-input" placeholder="me-product-name" />
            </div>
            <div>
              <label class="admin-label">Emoji</label>
              <input v-model="form.emoji" class="admin-input" placeholder="⚡" />
            </div>
            <div class="sm:col-span-2">
              <label class="admin-label">Name</label>
              <input v-model="form.name" class="admin-input" placeholder="ME PRODUCT NAME" />
            </div>
            <div class="sm:col-span-2">
              <label class="admin-label">Tagline</label>
              <input v-model="form.tagline" class="admin-input" placeholder="Short punchy tagline" />
            </div>
            <div class="sm:col-span-2">
              <label class="admin-label">Description</label>
              <textarea v-model="form.description" class="admin-input" rows="3" placeholder="Full product description..." />
            </div>
            <div>
              <label class="admin-label">Price (R)</label>
              <input v-model.number="form.price" type="number" step="0.01" class="admin-input" placeholder="49.99" />
            </div>
            <div>
              <label class="admin-label">Original Price (R, optional)</label>
              <input v-model.number="form.originalPrice" type="number" step="0.01" class="admin-input" placeholder="59.99" />
            </div>
            <div>
              <label class="admin-label">Category</label>
              <select v-model="form.category" class="admin-input">
                <option value="pre-workout">Pre-Workout</option>
                <option value="protein">Protein</option>
                <option value="creatine">Creatine</option>
                <option value="energy">Energy Drinks</option>
                <option value="fat-burner">Fat Burners</option>
                <option value="recovery">Recovery</option>
                <option value="hydration">Hydration</option>
              </select>
            </div>
            <div>
              <label class="admin-label">Category Label</label>
              <input v-model="form.categoryLabel" class="admin-input" placeholder="Pre-Workout" />
            </div>
            <div>
              <label class="admin-label">Stock</label>
              <input v-model.number="form.stock" type="number" class="admin-input" placeholder="100" />
            </div>
            <div>
              <label class="admin-label">Servings</label>
              <input v-model.number="form.servings" type="number" class="admin-input" placeholder="30" />
            </div>
            <div>
              <label class="admin-label">Badge Text (optional)</label>
              <input v-model="form.badge" class="admin-input" placeholder="BESTSELLER" />
            </div>
            <div>
              <label class="admin-label">Accent Color</label>
              <input v-model="form.accentColor" class="admin-input" placeholder="#b026ff" />
            </div>
            <div class="sm:col-span-2">
              <label class="admin-label">Flavours (comma-separated)</label>
              <input v-model="flavoursInput" class="admin-input" placeholder="Galaxy Punch, Neon Watermelon, Cosmic Berry" />
            </div>
            <div class="sm:col-span-2">
              <label class="admin-label">Sizes (comma-separated)</label>
              <input v-model="sizesInput" class="admin-input" placeholder="300g, 600g" />
            </div>
            <div class="sm:col-span-2">
              <label class="admin-label">Key Benefits (comma-separated)</label>
              <input v-model="benefitsInput" class="admin-input" placeholder="350mg Caffeine, 6g Citrulline" />
            </div>
            <div class="sm:col-span-2">
              <label class="admin-label">Ingredients</label>
              <textarea v-model="form.ingredients" class="admin-input" rows="2" />
            </div>
            <div class="sm:col-span-2 flex flex-wrap gap-4 sm:gap-6">
              <label class="flex items-center gap-2 text-sm font-rajdhani text-gray-400 cursor-pointer">
                <input v-model="form.featured" type="checkbox" class="accent-purple-500 w-4 h-4" />
                Featured
              </label>
              <label class="flex items-center gap-2 text-sm font-rajdhani text-gray-400 cursor-pointer">
                <input v-model="form.bestseller" type="checkbox" class="accent-pink-500 w-4 h-4" />
                Bestseller
              </label>
              <label class="flex items-center gap-2 text-sm font-rajdhani text-gray-400 cursor-pointer">
                <input v-model="form.newArrival" type="checkbox" class="accent-cyan-500 w-4 h-4" />
                New Arrival
              </label>
            </div>
          </div>

          <p v-if="modalError" class="text-neon-pink text-xs font-rajdhani mt-4">{{ modalError }}</p>

          <div class="flex flex-col sm:flex-row gap-3 mt-6">
            <button class="btn-neon-primary flex-1 text-xs py-3 sm:py-2" :disabled="saving" @click="saveProduct">
              {{ saving ? 'SAVING...' : (editingProduct ? 'SAVE CHANGES' : 'CREATE PRODUCT') }}
            </button>
            <button class="btn-neon-secondary text-xs px-6 py-3 sm:py-2" @click="showModal = false">CANCEL</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete confirm -->
    <Transition name="fade">
      <div
        v-if="deletingProduct"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);"
      >
        <div class="w-full max-w-sm p-6 text-center" style="background: #0f0f1a; border: 1px solid rgba(255,45,120,0.5);">
          <div class="text-4xl mb-3">⚠️</div>
          <h3 class="font-orbitron font-bold text-white text-sm mb-2">DELETE PRODUCT?</h3>
          <p class="text-gray-400 font-rajdhani text-sm mb-6">
            "{{ deletingProduct.name }}" will be permanently removed from the database.
          </p>
          <div class="flex gap-3">
            <button
              class="flex-1 text-xs font-orbitron px-4 py-3 text-neon-pink transition-all hover:bg-neon-pink/10 min-h-[48px]"
              style="border: 1px solid rgba(255,45,120,0.5);"
              :disabled="saving"
              @click="deleteProduct"
            >{{ saving ? 'DELETING...' : 'DELETE' }}</button>
            <button class="flex-1 btn-neon-secondary text-xs min-h-[48px]" @click="deletingProduct = null">CANCEL</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const { data: products, pending, refresh } = await useFetch<any[]>('/api/admin/products')

const showModal = ref(false)
const editingProduct = ref<any>(null)
const deletingProduct = ref<any>(null)
const saving = ref(false)
const modalError = ref('')

const flavoursInput = ref('')
const sizesInput = ref('')
const benefitsInput = ref('')

const emptyForm = () => ({
  id: '', name: '', tagline: '', description: '',
  price: 0, originalPrice: null as number | null,
  category: 'pre-workout', categoryLabel: '',
  badge: '', badgeColor: 'neon-purple',
  stock: 0, servings: 30, rating: 4.5, reviews: 0,
  ingredients: '', emoji: '⚡', gradient: '',
  accentColor: '#b026ff', featured: false, bestseller: false, newArrival: false,
  flavours: [] as string[], sizes: [] as string[], keyBenefits: [] as string[],
})

const form = reactive(emptyForm())

function openCreate() {
  Object.assign(form, emptyForm())
  flavoursInput.value = ''
  sizesInput.value = ''
  benefitsInput.value = ''
  editingProduct.value = null
  modalError.value = ''
  showModal.value = true
}

function openEdit(p: any) {
  Object.assign(form, {
    ...p,
    originalPrice: p.originalPrice ?? null,
  })
  flavoursInput.value = (p.flavours || []).join(', ')
  sizesInput.value = (p.sizes || []).join(', ')
  benefitsInput.value = (p.keyBenefits || []).join(', ')
  editingProduct.value = p
  modalError.value = ''
  showModal.value = true
}

async function saveProduct() {
  modalError.value = ''
  if (!form.id || !form.name || !form.price || !form.category) {
    modalError.value = 'ID, Name, Price and Category are required.'
    return
  }
  saving.value = true
  try {
    form.flavours = flavoursInput.value.split(',').map(s => s.trim()).filter(Boolean)
    form.sizes = sizesInput.value.split(',').map(s => s.trim()).filter(Boolean)
    form.keyBenefits = benefitsInput.value.split(',').map(s => s.trim()).filter(Boolean)
    form.categoryLabel = form.categoryLabel || form.category

    if (editingProduct.value) {
      await $fetch(`/api/admin/products/${form.id}`, { method: 'PUT', body: form })
    }
    else {
      await $fetch('/api/admin/products', { method: 'POST', body: form })
    }
    await refresh()
    showModal.value = false
  }
  catch (e: any) {
    modalError.value = e?.data?.statusMessage || 'Failed to save product.'
  }
  finally {
    saving.value = false
  }
}

async function toggleFeatured(p: any) {
  await $fetch(`/api/admin/products/${p.id}`, {
    method: 'PUT',
    body: { ...p, featured: !p.featured, flavours: p.flavours, sizes: p.sizes, keyBenefits: p.keyBenefits },
  })
  await refresh()
}

function confirmDelete(p: any) {
  deletingProduct.value = p
}

async function deleteProduct() {
  if (!deletingProduct.value) return
  saving.value = true
  try {
    await $fetch(`/api/admin/products/${deletingProduct.value.id}`, { method: 'DELETE' })
    await refresh()
    deletingProduct.value = null
  }
  finally {
    saving.value = false
  }
}

useHead({ title: 'Products — MyEnergy Admin' })
</script>

<style>
.admin-label { @apply block text-xs font-orbitron text-gray-500 tracking-wider mb-1.5; }
.admin-input {
  @apply w-full bg-dark-800 text-white text-sm font-rajdhani px-3 py-2.5 outline-none;
  border: 1px solid rgba(176,38,255,0.25);
}
.admin-input:focus { border-color: rgba(176,38,255,0.6); }
.admin-input option { background: #0f0f1a; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
