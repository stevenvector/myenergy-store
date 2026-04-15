export default defineEventHandler(async (event) => {
  const { password } = await readBody(event)
  const config = useRuntimeConfig()

  if (password !== (config.adminPassword || 'myenergy2026')) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid password' })
  }

  const token = Buffer.from(config.adminPassword || 'myenergy2026').toString('base64')

  setCookie(event, 'admin_token', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  })

  return { success: true }
})
