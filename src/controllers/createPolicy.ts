import { FastifyReply, FastifyRequest } from 'fastify'
import { InMemomryPolicyRepository } from '../repositories/in-memory-db/inMemoryPolicyRepository'
import { PolicyRepository } from '../repositories/policyRepository'
import { CreatePolicyUseCase } from '../use-cases/createPolicy'

const policyRepository: PolicyRepository = new InMemomryPolicyRepository()
const createPolicyUseCase = new CreatePolicyUseCase(policyRepository)

export async function createPolicy(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const { policyName, comparators } = request.body

  const newPolicy = await createPolicyUseCase.execute({ policyName, comparators })

  return response.status(201).send(newPolicy)
}
