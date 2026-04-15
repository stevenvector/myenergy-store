import type { H3Event } from 'h3'

export function requireAdmin(event: H3Event) {
  const config = useRuntimeConfig()
  const token = getCookie(event, 'admin_token')
  const expectedToken = Buffer.from(config.adminPassword || 'myenergy2026').toString('base64')

  if (token !== expectedToken) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorised' })
  }
}
