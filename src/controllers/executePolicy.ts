import { FastifyReply, FastifyRequest } from 'fastify'
import { PolicyRepository } from '../repositories/policyRepository'
import { ExecutePolicyUseCase } from '../use-cases/executePolicy'
import { PrismaPolicyRepository } from '../repositories/prisma/PrismaPolicyRepository'

const policyRepository: PolicyRepository = new PrismaPolicyRepository()
const executePolicyUseCase = new ExecutePolicyUseCase(policyRepository)

export async function executePolicy(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const { policyName, tests } = request.body

  const result = await executePolicyUseCase.execute({
    policyName,
    tests,
  })

  return response.status(200).send(result)
}
