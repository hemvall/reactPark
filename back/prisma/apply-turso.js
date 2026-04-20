import 'dotenv/config'
import { createClient } from '@libsql/client'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
})

const sql = readFileSync(join(__dirname, 'turso-init.sql'), 'utf8')
const statements = sql.split(';').map(s => s.trim()).filter(Boolean)

for (const statement of statements) {
  await client.execute(statement)
  console.log('OK:', statement.slice(0, 60) + '...')
}

console.log('Schema appliqué avec succès.')
