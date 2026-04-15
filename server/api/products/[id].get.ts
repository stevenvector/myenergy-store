import { useDB } from '~/server/utils/db'

function toProduct(r: Record<string, unknown>) {
  return {
    id: r.id,
    name: r.name,
    tagline: r.tagline,
    description: r.description,
    price: parseFloat(r.price as string),
    originalPrice: r.original_price ? parseFloat(r.original_price as string) : undefined,
    category: r.category,
    categoryLabel: r.category_label,
    badge: r.badge,
    badgeColor: r.badge_color,
    rating: parseFloat(r.rating as string),
    reviews: r.reviews,
    stock: r.stock,
    servings: r.servings,
    flavours: r.flavours,
    sizes: r.sizes,
    keyBenefits: r.key_benefits,
    ingredients: r.ingredients,
    emoji: r.emoji,
    gradient: r.gradient,
    accentColor: r.accent_color,
    featured: r.featured,
    bestseller: r.bestseller,
    newArrival: r.new_arrival,
  }
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const sql = useDB()

  const [row] = await sql`SELECT * FROM products WHERE id = ${id!}`

  if (!row) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }

  const product = toProduct(row)

  const relatedRows = await sql`
    SELECT * FROM products
    WHERE category = ${product.category as string}
      AND id != ${id!}
    LIMIT 3
  `

  return {
    product,
    related: relatedRows.map(toProduct),
  }
})
