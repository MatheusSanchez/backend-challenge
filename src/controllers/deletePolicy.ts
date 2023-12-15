import { FastifyReply, FastifyRequest } from 'fastify'
import { InMemomryPolicyRepository } from '../repositories/in-memory-db/inMemoryPolicyRepository'
import { PolicyRepository } from '../repositories/policyRepository'
import { DeletePolicyUseCase } from '../use-cases/deletePolicy'

const policyRepository: PolicyRepository =
  InMemomryPolicyRepository.getInstance()
const deletePolicyUseCase = new DeletePolicyUseCase(policyRepository)

export async function deletePolicy(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const { policyName } = request.params

  const wasDeleted = await deletePolicyUseCase.execute({
    policyName,
  })

  if (wasDeleted) {
    return response.status(204).send()
  }

  return response.status(202).send()
}
