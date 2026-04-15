import { useDB } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const sql = useDB()

  const [{ count: totalProducts }] = await sql`SELECT COUNT(*) as count FROM products`
  const [{ count: totalOrders }] = await sql`SELECT COUNT(*) as count FROM orders`
  const [{ total: revenue }] = await sql`SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status != 'cancelled'`
  const [{ count: lowStock }] = await sql`SELECT COUNT(*) as count FROM products WHERE stock < 10`

  const recentOrders = await sql`
    SELECT id, first_name, last_name, email, total, status, created_at
    FROM orders ORDER BY created_at DESC LIMIT 5
  `

  const topProducts = await sql`
    SELECT id, name, emoji, price, stock, reviews, rating
    FROM products ORDER BY reviews DESC LIMIT 5
  `

  return {
    totalProducts: parseInt(totalProducts as string),
    totalOrders: parseInt(totalOrders as string),
    revenue: parseFloat(revenue as string),
    lowStock: parseInt(lowStock as string),
    recentOrders,
    topProducts,
  }
})
