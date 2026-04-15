import postgres from 'postgres'

let _sql: ReturnType<typeof postgres> | null = null

export function useDB() {
  if (!_sql) {
    const config = useRuntimeConfig()
    const url = config.databaseUrl || process.env.DATABASE_URL

    if (!url) throw new Error('DATABASE_URL is not set')

    _sql = postgres(url, {
      ssl: 'require',
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    })
  }
  return _sql
}
