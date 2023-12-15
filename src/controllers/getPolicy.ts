import { FastifyReply, FastifyRequest } from 'fastify'
import { InMemomryPolicyRepository } from '../repositories/in-memory-db/inMemoryPolicyRepository'
import { PolicyRepository } from '../repositories/policyRepository'
import { FetchPolicyUseCase } from '../use-cases/fetchPolicy'

const policyRepository: PolicyRepository =
  InMemomryPolicyRepository.getInstance()
const fetchPolicyUseCase = new FetchPolicyUseCase(policyRepository)

export async function getPolicy(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const { policyName } = request.params
  const policy = await fetchPolicyUseCase.execute({ policyName })

  return response.status(200).send(policy)
}
