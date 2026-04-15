import { useDB } from '~/server/utils/db'
import { requireAdmin } from '~/server/utils/adminAuth'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const sql = useDB()
  const id = getRouterParam(event, 'id')

  // PUT — update product
  if (event.method === 'PUT') {
    const b = await readBody(event)

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
        rating        = ${b.rating || 0},
        reviews       = ${b.reviews || 0},
        stock         = ${b.stock || 0},
        servings      = ${b.servings || 0},
        flavours      = ${JSON.stringify(b.flavours || [])},
        sizes         = ${JSON.stringify(b.sizes || [])},
        key_benefits  = ${JSON.stringify(b.keyBenefits || [])},
        ingredients   = ${b.ingredients || ''},
        emoji         = ${b.emoji || '⚡'},
        gradient      = ${b.gradient || ''},
        accent_color  = ${b.accentColor || '#b026ff'},
        featured      = ${b.featured || false},
        bestseller    = ${b.bestseller || false},
        new_arrival   = ${b.newArrival || false}
      WHERE id = ${id!}
      RETURNING *
    `

    if (!row) throw createError({ statusCode: 404, statusMessage: 'Product not found' })
    return row
  }

  // DELETE — remove product
  if (event.method === 'DELETE') {
    await sql`DELETE FROM products WHERE id = ${id!}`
    return { success: true }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
})
