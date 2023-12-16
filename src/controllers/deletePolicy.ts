import { FastifyReply, FastifyRequest } from 'fastify'
import { PolicyRepository } from '../repositories/policyRepository'
import { DeletePolicyUseCase } from '../use-cases/deletePolicy'
import { PrismaPolicyRepository } from '../repositories/prisma/PrismaPolicyRepository'
import { ResourceNotFoundError } from '../use-cases/errors/resourceNotFound'
import { z } from 'zod'

const policyRepository: PolicyRepository = new PrismaPolicyRepository()
const deletePolicyUseCase = new DeletePolicyUseCase(policyRepository)

export async function deletePolicy(
  request: FastifyRequest,
  response: FastifyReply,
) {
  const deletePolicyParamsSchmea = z.object({
    policyName: z.string(),
  })
  const { policyName } = deletePolicyParamsSchmea.parse(request.params)

  let deletedPolicy

  try {
    deletedPolicy = await deletePolicyUseCase.execute({
      policyName,
    })
  } catch (e) {
    if (e instanceof ResourceNotFoundError) {
      return response.status(202).send({ message: e.message })
    }

    throw e
  }

  return response.status(200).send(deletedPolicy)
}
