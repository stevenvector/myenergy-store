import { useDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const sql = useDB()

  // Validate required fields
  const required = ['firstName', 'lastName', 'email', 'address', 'city', 'postcode', 'items']
  for (const field of required) {
    if (!body[field]) {
      throw createError({ statusCode: 400, statusMessage: `Missing field: ${field}` })
    }
  }

  if (!body.items || body.items.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Cart is empty' })
  }

  const orderId = `ME-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

  // Persist order
  await sql`
    INSERT INTO orders (
      id, status, first_name, last_name, email, phone,
      address, address2, city, postcode, country,
      subtotal, shipping_cost, total
    ) VALUES (
      ${orderId}, 'confirmed',
      ${body.firstName}, ${body.lastName}, ${body.email}, ${body.phone || null},
      ${body.address}, ${body.address2 || null}, ${body.city}, ${body.postcode},
      ${body.country || 'ZA'},
      ${body.subtotal}, ${body.shippingCost}, ${body.total}
    )
  `

  // Persist order items
  for (const item of body.items) {
    await sql`
      INSERT INTO order_items (order_id, product_id, product_name, price, quantity, flavour, size, emoji, accent_color)
      VALUES (${orderId}, ${item.id}, ${item.name}, ${item.price}, ${item.quantity}, ${item.flavour}, ${item.size}, ${item.emoji}, ${item.accentColor})
    `
  }

  // Decrement stock for each item
  for (const item of body.items) {
    await sql`
      UPDATE products
      SET stock = GREATEST(stock - ${item.quantity}, 0)
      WHERE id = ${item.id}
    `
  }

  return {
    success: true,
    order: {
      id: orderId,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      customer: { firstName: body.firstName, lastName: body.lastName, email: body.email },
      shippingAddress: { address: body.address, city: body.city, postcode: body.postcode, country: body.country || 'ZA' },
      items: body.items,
      subtotal: body.subtotal,
      shippingCost: body.shippingCost,
      total: body.total,
    },
  }
})
