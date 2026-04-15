import { useDB } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = query.category as string | undefined
  const search = query.search as string | undefined
  const featured = query.featured as string | undefined
  const sort = query.sort as string | undefined

  const sql = useDB()

  // Build dynamic WHERE clauses
  const conditions: string[] = []
  const values: unknown[] = []
  let i = 1

  if (category && category !== 'all') {
    conditions.push(`category = $${i++}`)
    values.push(category)
  }

  if (search) {
    conditions.push(`(name ILIKE $${i} OR tagline ILIKE $${i} OR description ILIKE $${i} OR category_label ILIKE $${i})`)
    values.push(`%${search}%`)
    i++
  }

  if (featured === 'true') {
    conditions.push(`featured = true`)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const orderMap: Record<string, string> = {
    'price-asc': 'price ASC',
    'price-desc': 'price DESC',
    'rating': 'rating DESC',
    'reviews': 'reviews DESC',
    'newest': 'new_arrival DESC, created_at DESC',
  }
  const orderBy = `ORDER BY ${sort && orderMap[sort] ? orderMap[sort] : 'featured DESC, bestseller DESC, created_at ASC'}`

  const rows = await sql.unsafe(`SELECT * FROM products ${where} ${orderBy}`, values as string[])

  // Map snake_case DB columns → camelCase for the frontend
  return rows.map(toProduct)
})

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
