export default defineNuxtRouteMiddleware(() => {
  const adminAuth = useCookie('admin_token')
  if (!adminAuth.value) {
    return navigateTo('/admin/login')
  }
})
