<template>
  <div class="noise-overlay min-h-screen bg-dark-900">
    <AppHeader />
    <CartSidebar />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
