import type { H3Event } from 'h3'

export function requireAdmin(event: H3Event) {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'admin_token')
  const adminPassword = (config.adminPassword as string || 'myenergy2026').trim()
  const expectedToken = Buffer.from(adminPassword).toString('base64')

  if (token !== expectedToken) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorised' })
  }
}
