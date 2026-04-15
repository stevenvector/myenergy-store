import { useDB } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'

const VALID_STATUSES = ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const sql = useDB()
  const id = getRouterParam(event, 'id')
  const { status } = await readBody(event)

  if (!VALID_STATUSES.includes(status)) {
    throw createError({ statusCode: 400, statusMessage: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` })
  }

  const [row] = await sql`
    UPDATE orders SET status = ${status} WHERE id = ${id!} RETURNING *
  `

  if (!row) throw createError({ statusCode: 404, statusMessage: 'Order not found' })

  return { success: true, order: row }
})
