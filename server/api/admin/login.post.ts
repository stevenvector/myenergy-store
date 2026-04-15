export default defineEventHandler(async (event) => {
  const { password } = await readBody(event)
  const config = useRuntimeConfig()
  const adminPassword = (config.adminPassword as string || 'myenergy2026').trim()

  if (password.trim() !== adminPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid password' })
  }

  const token = Buffer.from(adminPassword).toString('base64')

  setCookie(event, 'admin_token', token, {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
    secure: true,
  })

  return { success: true }
})
