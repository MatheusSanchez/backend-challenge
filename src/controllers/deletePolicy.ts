import { FastifyReply, FastifyRequest } from 'fastify'
import { PolicyRepository } from '../repositories/policyRepository'
import { DeletePolicyUseCase } from '../use-cases/deletePolicy'
import { PrismaPolicyRepository } from '../repositories/prisma/PrismaPolicyRepository'

const policyRepository: PolicyRepository = new PrismaPolicyRepository()
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
