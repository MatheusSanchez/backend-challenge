import { FastifyReply, FastifyRequest } from 'fastify'
import { PolicyRepository } from '../repositories/policyRepository'
import { FetchPolicyUseCase } from '../use-cases/fetchPolicy'
import { ResourceNotFoundError } from '../use-cases/errors/resourceNotFound'
import { z } from 'zod'
import { PrismaPolicyRepository } from '../repositories/prisma/PrismaPolicyRepository'

const policyRepository: PolicyRepository = new PrismaPolicyRepository()
const fetchPolicyUseCase = new FetchPolicyUseCase(policyRepository)

export async function getPolicy(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const getPolicyParamsSchmea = z.object({
    policyName: z.string(),
  })
  const { policyName } = getPolicyParamsSchmea.parse(request.params)

  let policy

  try {
    policy = await fetchPolicyUseCase.execute({ policyName })
  } catch (e) {
    if (e instanceof ResourceNotFoundError) {
      return response.status(404).send({ message: e.message })
    }

    throw e
  }

  return response.status(200).send(policy)
}
