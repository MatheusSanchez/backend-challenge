import fastify from 'fastify'
import { ZodError } from 'zod'
import { policyRoutes } from './controllers/routes'

export const app = fastify()
app.register(policyRoutes)

app.setErrorHandler((error, _, response) => {
  if (error instanceof ZodError) {
    return response
      .status(400)
      .send({ message: 'Validation Error', issues: error.format() })
  }

  return response.status(500).send({ message: 'Internal Server Error' })
})
