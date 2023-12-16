import fastify from 'fastify'
import { policyRoutes } from './controllers/routes'
import { ZodError } from 'zod'

const app = fastify()
app.register(policyRoutes)

app.setErrorHandler((error, _, response) => {
  if (error instanceof ZodError) {
    return response
      .status(400)
      .send({ message: 'Validation Error', issues: error.format() })
  }

  return response.status(500).send({ message: 'Internal Server Error' })
})

app
  .listen({
    host: '0.0.0.0',
    port: 3333,
  })
  .then(() => {
    console.log('🔥🔥🔥 HTTP Server Running! 🔥🔥🔥')
  })
