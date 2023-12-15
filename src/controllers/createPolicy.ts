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
  const { name, comparators } = request.body

  const newPolicy = await createPolicyUseCase.execute({ name, comparators })

  return response.status(201).send(newPolicy)
}
