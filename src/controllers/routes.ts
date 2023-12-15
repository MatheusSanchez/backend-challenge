import { FastifyInstance } from 'fastify'
import { createPolicy } from './createPolicy'

export async function policyRoutes(app: FastifyInstance) {
  app.post('/policy', createPolicy)
}
