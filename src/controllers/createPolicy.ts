import { FastifyReply, FastifyRequest } from 'fastify'
import { PolicyRepository } from '../repositories/policyRepository'
import { CreatePolicyUseCase } from '../use-cases/createPolicy'
import { PrismaPolicyRepository } from '../repositories/prisma/PrismaPolicyRepository'

const policyRepository: PolicyRepository = new PrismaPolicyRepository()
const createPolicyUseCase = new CreatePolicyUseCase(policyRepository)

export async function createPolicy(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const { policyName, comparators } = request.body

  const newPolicy = await createPolicyUseCase.execute({
    policyName,
    comparators,
  })

  return response.status(201).send(newPolicy)
}
