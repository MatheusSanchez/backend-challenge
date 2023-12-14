import fastify from 'fastify'

const app = fastify()
app.get('/policy/test', (request, response) => {
  response.send('Working')
})

app
  .listen({
    host: '0.0.0.0',
    port: 3333,
  })
  .then(() => {
    console.log('🔥🔥🔥 HTTP Server Running! 🔥🔥🔥')
  })
