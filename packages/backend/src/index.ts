import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { trpcServer } from '@hono/trpc-server'
import { appRouter } from './routers/index.js'
import { createContext } from './lib/trpc.js'

const app = new Hono()

app.use('*', logger())
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:80', 'http://localhost'],
  credentials: true,
}))

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext
  })
)

app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

app.onError((err, c) => {
  console.error('Server error:', err)
  return c.json({ error: 'Internal Server Error' }, 500)
})

const port = parseInt(process.env.PORT || '3001')

console.log(`🚀 Server is running on http://localhost:${port}`)
console.log(`📡 tRPC endpoint: http://localhost:${port}/trpc`)

serve({
  fetch: app.fetch,
  port,
})
