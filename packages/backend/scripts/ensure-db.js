import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

// Get current directory (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Path to your SQLite database file
const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db')
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma')

console.log('🔍 Checking database setup...')

// Check if schema file exists
if (!fs.existsSync(schemaPath)) {
  console.error('❌ Prisma schema not found at:', schemaPath)
  process.exit(1)
}

// Check if database file exists (for SQLite)
const dbExists = fs.existsSync(dbPath)

// Check if Prisma client is generated
const clientPath = path.join(__dirname, '..', 'node_modules', '.prisma', 'client')
const clientExists = fs.existsSync(clientPath)

if (!clientExists) {
  console.log('📦 Generating Prisma client...')
  try {
    execSync('npx prisma generate', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    })
    console.log('✅ Prisma client generated successfully')
  } catch (error) {
    console.error('❌ Failed to generate Prisma client:', error.message)
    process.exit(1)
  }
}

if (!dbExists) {
  console.log('🗄️  Database not found, creating database...')
  try {
    execSync('npx prisma db push', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    })
    console.log('✅ Database created and schema applied successfully')
  } catch (error) {
    console.error('❌ Failed to create database:', error.message)
    process.exit(1)
  }
} else {
  console.log('✅ Database exists')
}

console.log('🚀 Database setup complete, starting development server...\n')
