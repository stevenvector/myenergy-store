import postgres from 'postgres'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const DATABASE_URL = 'postgresql://neondb_owner:npg_KMCUPT9u6RQj@ep-tiny-salad-aluubdyp-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require'

const sql = postgres(DATABASE_URL, { ssl: 'require' })

async function migrate() {
  console.log('🔌 Connecting to Neon DB...')

  // ─── Create tables ───────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id              VARCHAR(255) PRIMARY KEY,
      name            VARCHAR(255) NOT NULL,
      tagline         TEXT,
      description     TEXT,
      price           DECIMAL(10,2) NOT NULL,
      original_price  DECIMAL(10,2),
      category        VARCHAR(100) NOT NULL,
      category_label  VARCHAR(100),
      badge           VARCHAR(100),
      badge_color     VARCHAR(100),
      rating          DECIMAL(3,1) DEFAULT 0,
      reviews         INTEGER      DEFAULT 0,
      stock           INTEGER      DEFAULT 0,
      servings        INTEGER      DEFAULT 0,
      flavours        JSONB        DEFAULT '[]',
      sizes           JSONB        DEFAULT '[]',
      key_benefits    JSONB        DEFAULT '[]',
      ingredients     TEXT,
      emoji           VARCHAR(20),
      gradient        VARCHAR(255),
      accent_color    VARCHAR(50),
      featured        BOOLEAN      DEFAULT false,
      bestseller      BOOLEAN      DEFAULT false,
      new_arrival     BOOLEAN      DEFAULT false,
      created_at      TIMESTAMPTZ  DEFAULT NOW(),
      updated_at      TIMESTAMPTZ  DEFAULT NOW()
    )
  `
  console.log('✅ products table ready')

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id            VARCHAR(255) PRIMARY KEY,
      status        VARCHAR(100)  DEFAULT 'confirmed',
      first_name    VARCHAR(255),
      last_name     VARCHAR(255),
      email         VARCHAR(255),
      phone         VARCHAR(100),
      address       TEXT,
      address2      TEXT,
      city          VARCHAR(255),
      postcode      VARCHAR(50),
      country       VARCHAR(10)   DEFAULT 'ZA',
      subtotal      DECIMAL(10,2),
      shipping_cost DECIMAL(10,2),
      total         DECIMAL(10,2),
      created_at    TIMESTAMPTZ   DEFAULT NOW(),
      updated_at    TIMESTAMPTZ   DEFAULT NOW()
    )
  `
  console.log('✅ orders table ready')

  await sql`
    CREATE TABLE IF NOT EXISTS order_items (
      id           SERIAL       PRIMARY KEY,
      order_id     VARCHAR(255) REFERENCES orders(id) ON DELETE CASCADE,
      product_id   VARCHAR(255),
      product_name VARCHAR(255),
      price        DECIMAL(10,2),
      quantity     INTEGER,
      flavour      VARCHAR(255),
      size         VARCHAR(255),
      emoji        VARCHAR(20),
      accent_color VARCHAR(50)
    )
  `
  console.log('✅ order_items table ready')

  // ─── Updated_at trigger ──────────────────────────────────────
  await sql`
    CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
    $$ language 'plpgsql'
  `
  for (const table of ['products', 'orders']) {
    await sql`
      DROP TRIGGER IF EXISTS ${sql(`set_updated_at_${table}`)} ON ${sql(table)}
    `
    await sql`
      CREATE TRIGGER ${sql(`set_updated_at_${table}`)}
      BEFORE UPDATE ON ${sql(table)}
      FOR EACH ROW EXECUTE FUNCTION update_updated_at()
    `
  }
  console.log('✅ updated_at triggers ready')

  await sql.end()
  console.log('🎉 Migration complete!')
}

migrate().catch((e) => { console.error('Migration failed:', e); process.exit(1) })
