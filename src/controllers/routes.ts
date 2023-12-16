import { FastifyInstance } from 'fastify'
import { createPolicy } from './createPolicy'
import { getAllPolicies } from './getAllPolicies'
import { deletePolicy } from './deletePolicy'
import { getPolicy } from './getPolicy'
import { executePolicy } from './executePolicy'

export async function policyRoutes(app: FastifyInstance) {
  app.post('/policy', createPolicy)
  app.delete('/policy/:policyName', deletePolicy)

  app.post('/execute', executePolicy)
  app.get('/policy/all', getAllPolicies)
  app.get('/policy/:policyName', getPolicy)
}
