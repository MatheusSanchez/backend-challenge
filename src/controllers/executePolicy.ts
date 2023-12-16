import { FastifyReply, FastifyRequest } from 'fastify'
import { InMemomryPolicyRepository } from '../repositories/in-memory-db/inMemoryPolicyRepository'
import { PolicyRepository } from '../repositories/policyRepository'
import { ExecutePolicyUseCase } from '../use-cases/executePolicy'

const policyRepository: PolicyRepository =
  InMemomryPolicyRepository.getInstance()
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
