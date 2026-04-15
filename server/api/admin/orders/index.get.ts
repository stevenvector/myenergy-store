import { useDB } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const sql = useDB()

  const orders = await sql`
    SELECT o.*,
      json_agg(
        json_build_object(
          'id', oi.id,
          'productId', oi.product_id,
          'productName', oi.product_name,
          'price', oi.price,
          'quantity', oi.quantity,
          'flavour', oi.flavour,
          'size', oi.size,
          'emoji', oi.emoji
        )
      ) FILTER (WHERE oi.id IS NOT NULL) as items
    FROM orders o
    LEFT JOIN order_items oi ON oi.order_id = o.id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `

  return orders.map(o => ({
    id: o.id,
    status: o.status,
    firstName: o.first_name,
    lastName: o.last_name,
    email: o.email,
    phone: o.phone,
    address: o.address,
    city: o.city,
    postcode: o.postcode,
    country: o.country,
    subtotal: parseFloat(o.subtotal as string),
    shippingCost: parseFloat(o.shipping_cost as string),
    total: parseFloat(o.total as string),
    createdAt: o.created_at,
    items: o.items || [],
  }))
})
