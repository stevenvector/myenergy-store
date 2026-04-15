import { useDB } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'

function toProduct(r: Record<string, unknown>) {
  return {
    id: r.id, name: r.name, tagline: r.tagline, description: r.description,
    price: parseFloat(r.price as string),
    originalPrice: r.original_price ? parseFloat(r.original_price as string) : null,
    category: r.category, categoryLabel: r.category_label,
    badge: r.badge, badgeColor: r.badge_color,
    rating: parseFloat(r.rating as string), reviews: r.reviews,
    stock: r.stock, servings: r.servings,
    flavours: r.flavours, sizes: r.sizes, keyBenefits: r.key_benefits,
    ingredients: r.ingredients, emoji: r.emoji, gradient: r.gradient, accentColor: r.accent_color,
    featured: r.featured, bestseller: r.bestseller, newArrival: r.new_arrival,
    createdAt: r.created_at, updatedAt: r.updated_at,
  }
}

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const sql = useDB()

  // GET — list all products
  if (event.method === 'GET') {
    const rows = await sql`SELECT * FROM products ORDER BY created_at DESC`
    return rows.map(toProduct)
  }

  // POST — create new product
  if (event.method === 'POST') {
    const b = await readBody(event)

    if (!b.id || !b.name || !b.price || !b.category) {
      throw createError({ statusCode: 400, statusMessage: 'id, name, price and category are required' })
    }

    const [row] = await sql`
      INSERT INTO products (
        id, name, tagline, description, price, original_price,
        category, category_label, badge, badge_color,
        rating, reviews, stock, servings,
        flavours, sizes, key_benefits, ingredients,
        emoji, gradient, accent_color, featured, bestseller, new_arrival
      ) VALUES (
        ${b.id}, ${b.name}, ${b.tagline || ''}, ${b.description || ''},
        ${b.price}, ${b.originalPrice || null},
        ${b.category}, ${b.categoryLabel || b.category},
        ${b.badge || null}, ${b.badgeColor || null},
        ${b.rating ?? 4.5}, ${b.reviews ?? 0}, ${b.stock ?? 0}, ${b.servings ?? 0},
        ${sql.json(b.flavours || [])}, ${sql.json(b.sizes || [])},
        ${sql.json(b.keyBenefits || [])}, ${b.ingredients || ''},
        ${b.emoji || '⚡'}, ${b.gradient || ''}, ${b.accentColor || '#b026ff'},
        ${b.featured ?? false}, ${b.bestseller ?? false}, ${b.newArrival ?? false}
      )
      RETURNING *
    `
    return toProduct(row)
  }
})
