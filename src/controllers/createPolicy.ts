import { FastifyReply, FastifyRequest } from 'fastify'
import { InMemomryPolicyRepository } from '../repositories/in-memory-db/inMemoryPolicyRepository'
import { PolicyRepository } from '../repositories/policyRepository'
import { CreatePolicyUseCase } from '../use-cases/createPolicy'

export async function createPolicy(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const policyRepository: PolicyRepository = new InMemomryPolicyRepository()
  const createPolicyUseCase = new CreatePolicyUseCase(policyRepository)

  const { name } = request.body

  const newPolicy = await createPolicyUseCase.execute({ name })

  return response.status(201).send(newPolicy)
}
