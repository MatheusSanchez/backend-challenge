import { FastifyReply, FastifyRequest } from 'fastify'
import { InMemomryPolicyRepository } from '../repositories/in-memory-db/inMemoryPolicyRepository'
import { PolicyRepository } from '../repositories/policyRepository'
import { FetchAllPoliciesUseCase } from '../use-cases/fetchAllPolicies'

const policyRepository: PolicyRepository =
  InMemomryPolicyRepository.getInstance()
const fetchAllPoliciesUseCase = new FetchAllPoliciesUseCase(policyRepository)

export async function getAllPolicies(
  _request: FastifyRequest,
  response: FastifyReply,
) {
  const policies = await fetchAllPoliciesUseCase.execute()

  return response.status(200).send(policies)
}
