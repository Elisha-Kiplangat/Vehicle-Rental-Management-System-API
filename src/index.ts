import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import 'dotenv/config'
import { cors } from 'hono/cors'


import { usersRouter } from './users/users.router'
import { authRouter } from './auth/auth.router'
import { vehiclesRouter } from './vehicle/vehicle.router'
import { vehicleSpecsRouter } from './vehicleSpecification/vehicleSpecification.router'
import { bookingsRouter } from './booking/booking.router'
import { paymentsRouter } from './payments/payments.router'
import { supportTicketsRouter } from './customerSupportTicket/customerSupportTicket.router'
import { locationsRouter } from './location/location.router'
import { branchesRouter } from './branches/branches.router'
import { fleetRouter } from './fleetManagement/fleetManagement.router'


const app = new Hono()

app.use('/*', cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/', usersRouter)

app.route('/', authRouter)

app.route('/', vehiclesRouter)

app.route('/', vehicleSpecsRouter)

app.route('/', bookingsRouter)

app.route('/', paymentsRouter)

app.route('/', supportTicketsRouter)

app.route('/', locationsRouter)

app.route('/', branchesRouter)

app.route('/', fleetRouter)

serve({
  fetch: app.fetch,
  port: parseInt(process.env.PORT || '3000')
})

console.log(`Server is running on port ${process.env.PORT}`)
