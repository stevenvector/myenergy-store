import { useDB } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'

function toProduct(r: Record<string, unknown>) {
  return {
    id: r.id, name: r.name, tagline: r.tagline, description: r.description,
    price: parseFloat(r.price as string),
    originalPrice: r.original_price ? parseFloat(r.original_price as string) : null,
    category: r.category, categoryLabel: r.category_label,
    badge: r.badge, badgeColor: r.badge_color,
    rating: parseFloat(r.rating as string), reviews: Number(r.reviews),
    stock: Number(r.stock), servings: Number(r.servings),
    flavours: r.flavours, sizes: r.sizes, keyBenefits: r.key_benefits,
    ingredients: r.ingredients, emoji: r.emoji, gradient: r.gradient,
    accentColor: r.accent_color, featured: r.featured,
    bestseller: r.bestseller, newArrival: r.new_arrival,
    createdAt: r.created_at, updatedAt: r.updated_at,
  }
}

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const sql = useDB()
  const id = getRouterParam(event, 'id')

  // GET — single product
  if (event.method === 'GET') {
    const [row] = await sql`SELECT * FROM products WHERE id = ${id!}`
    if (!row) throw createError({ statusCode: 404, statusMessage: 'Product not found' })
    return toProduct(row)
  }

  // PUT — update product
  if (event.method === 'PUT') {
    const b = await readBody(event)

    if (!b.name || !b.price || !b.category) {
      throw createError({ statusCode: 400, statusMessage: 'name, price and category are required' })
    }

    const [row] = await sql`
      UPDATE products SET
        name          = ${b.name},
        tagline       = ${b.tagline || ''},
        description   = ${b.description || ''},
        price         = ${b.price},
        original_price= ${b.originalPrice || null},
        category      = ${b.category},
        category_label= ${b.categoryLabel || b.category},
        badge         = ${b.badge || null},
        badge_color   = ${b.badgeColor || null},
        rating        = ${b.rating ?? 4.5},
        reviews       = ${b.reviews ?? 0},
        stock         = ${b.stock ?? 0},
        servings      = ${b.servings ?? 0},
        flavours      = ${sql.json(b.flavours || [])},
        sizes         = ${sql.json(b.sizes || [])},
        key_benefits  = ${sql.json(b.keyBenefits || [])},
        ingredients   = ${b.ingredients || ''},
        emoji         = ${b.emoji || '⚡'},
        gradient      = ${b.gradient || ''},
        accent_color  = ${b.accentColor || '#b026ff'},
        featured      = ${b.featured ?? false},
        bestseller    = ${b.bestseller ?? false},
        new_arrival   = ${b.newArrival ?? false}
      WHERE id = ${id!}
      RETURNING *
    `

    if (!row) throw createError({ statusCode: 404, statusMessage: 'Product not found' })
    return toProduct(row)
  }

  // DELETE — remove product
  if (event.method === 'DELETE') {
    const [row] = await sql`DELETE FROM products WHERE id = ${id!} RETURNING id`
    if (!row) throw createError({ statusCode: 404, statusMessage: 'Product not found' })
    return { success: true }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
