import { FastifyInstance } from 'fastify'
import { createPolicy } from './createPolicy'
import { schema } from '../utils/validationSchema'
import { getAllPolicies } from './getAllPolicies'

export async function policyRoutes(app: FastifyInstance) {
  app.post('/policy', { schema }, createPolicy)
  app.get('/policy/all', getAllPolicies)
}
