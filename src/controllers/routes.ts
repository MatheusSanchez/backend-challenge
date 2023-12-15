import { FastifyInstance } from 'fastify'
import { createPolicy } from './createPolicy'
import { schema } from '../utils/validationSchema'

export async function policyRoutes(app: FastifyInstance) {
  app.post('/policy', { schema }, createPolicy)
}
