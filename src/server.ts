import fastify from 'fastify'
import { prisma } from './lib/prisma'

const app = fastify()
app.post('/policy/test', async (request, response) => {
  const newPolicy = await prisma.policy.create({
    data: {
      name: 'testPolicy',
      comparators: {
        test: 'test',
      },
    },
  })

  return response.send(newPolicy)
})

app
  .listen({
    host: '0.0.0.0',
    port: 3333,
  })
  .then(() => {
    console.log('🔥🔥🔥 HTTP Server Running! 🔥🔥🔥')
  })
