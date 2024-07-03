import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config'
import { usersRouter } from './users/users.router'
import { authRouter } from './auth/auth.router'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/', usersRouter)

app.route('/', authRouter)

serve({
  fetch: app.fetch,
  port: parseInt(process.env.PORT || '3000')
})

console.log(`Server is running on port ${process.env.PORT}`)
