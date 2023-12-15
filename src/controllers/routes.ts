import { FastifyInstance } from 'fastify'
import { createPolicy } from './createPolicy'
import { schema } from '../utils/validationSchema'
import { getAllPolicies } from './getAllPolicies'
import { deletePolicy } from './deletePolicy'
import { getPolicy } from './getPolicy'

export async function policyRoutes(app: FastifyInstance) {
  app.post('/policy', { schema }, createPolicy)
  app.delete('/policy/:policyName', deletePolicy)

  app.get('/policy/all', getAllPolicies)
  app.get('/policy/:policyName', getPolicy)
}
