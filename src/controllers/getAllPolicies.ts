import { FastifyReply, FastifyRequest } from 'fastify'
import { PolicyRepository } from '../repositories/policyRepository'
import { FetchAllPoliciesUseCase } from '../use-cases/fetchAllPolicies'
import { PrismaPolicyRepository } from '../repositories/prisma/PrismaPolicyRepository'

const policyRepository: PolicyRepository = new PrismaPolicyRepository()
const fetchAllPoliciesUseCase = new FetchAllPoliciesUseCase(policyRepository)

export async function getAllPolicies(
  _request: FastifyRequest,
  response: FastifyReply,
) {
  const policies = await fetchAllPoliciesUseCase.execute()

  return response.status(200).send(policies)
}
